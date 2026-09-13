import {digest,validateShape,verifyEvidence} from './factory.mjs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
export function inspectCatalog(catalog,{validationRules}={}){
 const ids=new Set(),pointIds=new Set(),capIds=new Set(Object.keys(catalog.capabilities)),findings=[];
 const ruleIds=validationRules&&new Set(validationRules.map(r=>r.id));
 const requireCap=(id,owner)=>{if(!capIds.has(id))throw Error('Unknown capability '+id+' at '+owner);};
 for(const point of catalog.decisionPoints){
  if(pointIds.has(point.id))throw Error('Duplicate decision point');pointIds.add(point.id);
  if(!Number.isInteger(point.selection.min)||!Number.isInteger(point.selection.max)||point.selection.min<0||point.selection.max<point.selection.min||point.selection.max>point.options.length)throw Error('Invalid selection bounds');
  for(const option of point.options){
   if(ids.has(option.id))throw Error('Duplicate option '+option.id);ids.add(option.id);
   for(const key of catalog.optionContract.requiredFields)if(!Object.hasOwn(option,key))throw Error('Missing option field '+option.id+'/'+key);
   if(!catalog.optionContract.statusValues.includes(option.status))throw Error('Unknown option status '+option.id);
   if(!option.validationRefs.length||ruleIds&&option.validationRefs.some(id=>!ruleIds.has(id)))throw Error('Unknown or missing validation rule '+option.id);
   if(!['set_once_equal_or_conflict','append_unique_by_option_id'].includes(option.profileFragment.op)||option.profileFragment.path!=='/decisionsByPoint/'+point.id)throw Error('Unsupported fragment target');
   for(const cap of option.requires)requireCap(cap,option.id);
   for(const [name,schema] of Object.entries(option.parameters))validateShape(schema.default,schema,option.id+'/'+name);
   walk(option.children??[],new Set());
   function walk(nodes,ancestors){for(const n of nodes){if(n.kind==='capability_leaf'){requireCap(n.ref,option.id);continue;}if(n.kind!=='interpretation_choice'||ancestors.has(n.id)||!n.id||!Number.isInteger(n.select)||n.select<1||n.select>n.options.length)throw Error('Invalid recursive choice');const next=new Set([...ancestors,n.id]),local=new Set();for(const choice of n.options){if(local.has(choice.id))throw Error('Duplicate interpretation');local.add(choice.id);for(const cap of choice.requires??[])requireCap(cap,choice.id);walk(choice.children??[],next);}}}
  }
 }
 for(const point of catalog.decisionPoints)for(const option of point.options)for(const id of option.conflicts)if(!ids.has(id)&&!capIds.has(id))throw Error('Unknown conflict '+id);
 for(const [id,cap] of Object.entries(catalog.capabilities))if(cap.status!=='eligible')findings.push({id,status:cap.status,ownerGoal:cap.ownerGoal});
 for(const rule of catalog.compatibilityRules){if(!ids.has(rule.ifSelected))throw Error('Unknown compatibility source');for(const id of rule.requiresSelected??[])if(!ids.has(id))throw Error('Unknown required selection');if(rule.requiresCapability)requireCap(rule.requiresCapability,rule.id);}
 return {points:pointIds.size,options:ids.size,capabilities:capIds.size,ineligible:findings};
}
// Resolve supported choices into an intermediate profile. This does not claim a
// complete executable game; domain compilation and independent review follow.
export async function resolveCatalog(catalog,selections,{branches={},repoRoot,capabilityEvidence={},predicateChecks={}}){
 inspectCatalog(catalog);const byPoint=new Map(catalog.decisionPoints.map(p=>[p.id,p])),chosen=new Map(),required=new Set(),expanded=[],usedBranches=new Set();
 if(!Array.isArray(selections))throw Error('Expected selections array');
 const ensureCap=async id=>{
  const cap=catalog.capabilities[id],proof=capabilityEvidence[id];if(!cap||!proof||cap.status!=='eligible'||proof.verdict!=='PASS'||proof.catalogHash!==digest(catalog)||!proof.evidenceRefs?.length||!cap.implementationRefs.length)throw Error('Ineligible capability '+id);
  for(const ref of cap.implementationRefs){const f=path.resolve(repoRoot,ref.path);if(!f.startsWith(path.resolve(repoRoot)+path.sep)||digest(await readFile(f))!==ref.sha256)throw Error('Stale capability source '+id);}
  for(const ref of proof.evidenceRefs)await verifyEvidence(ref);required.add(id);
 };
 for(const s of selections){
  validateShape(s,{type:'object',additionalProperties:false,required:['pointId','optionId','parameters'],properties:{pointId:{type:'string'},optionId:{type:'string'},parameters:{type:'object'}}});
  const point=byPoint.get(s.pointId),option=point?.options.find(o=>o.id===s.optionId);if(!option||chosen.has(s.optionId))throw Error('Unknown or duplicate selected option');
  const parameters={};for(const key of Object.keys(s.parameters))if(!Object.hasOwn(option.parameters,key))throw Error('Unknown parameter');
  for(const [key,schema] of Object.entries(option.parameters)){parameters[key]=Object.hasOwn(s.parameters,key)?s.parameters[key]:schema.default;validateShape(parameters[key],schema,option.id+'/'+key);}
  for(const cap of option.requires)await ensureCap(cap);
  chosen.set(s.optionId,{pointId:point.id,optionId:option.id,parameters});
  await expand(option.children??[],new Set(),parameters.branchDepth??Infinity);
 }
 async function expand(nodes,ancestors,remaining){for(const n of nodes){
  if(n.kind==='capability_leaf'){await ensureCap(n.ref);continue;}
  if(remaining<=0||ancestors.has(n.id))throw Error('Unresolved recursive branch at depth boundary');
  const selection=branches[n.id];if(!Array.isArray(selection)||selection.length!==n.select||new Set(selection).size!==selection.length)throw Error('Missing or duplicate interpretation selection '+n.id);
  usedBranches.add(n.id);for(const id of selection){const opt=n.options.find(o=>o.id===id);if(!opt)throw Error('Unknown interpretation '+id);for(const cap of opt.requires??[])await ensureCap(cap);expanded.push({id,meaning:opt.meaning,requires:opt.requires});await expand(opt.children??[],new Set([...ancestors,n.id]),remaining-1);}
 }}
 for(const id of Object.keys(branches))if(!usedBranches.has(id))throw Error('Unused branch selection');
 const decisions=[];for(const point of catalog.decisionPoints){const selected=[...chosen.values()].filter(x=>x.pointId===point.id);if(selected.length<point.selection.min||selected.length>point.selection.max)throw Error('Selection count mismatch '+point.id);if(point.mergeRule==='set_once_equal_or_conflict'&&selected.length>1)throw Error('Conflicting single-value merge');decisions.push(...selected);}
 for(const s of chosen.values()){const option=byPoint.get(s.pointId).options.find(o=>o.id===s.optionId);for(const conflict of option.conflicts)if(chosen.has(conflict)||required.has(conflict))throw Error('Conflicting option '+s.optionId);}
 for(const rule of catalog.compatibilityRules){if(!chosen.has(rule.ifSelected))continue;for(const id of rule.requiresSelected??[])if(!chosen.has(id))throw Error('Incompatible selections: '+rule.id);if(rule.requiresCapability)await ensureCap(rule.requiresCapability);if(rule.predicate&&predicateChecks[rule.id]!==true)throw Error('Unproven predicate: '+rule.id);}
 return {executable:false,status:'RESOLVED_CHOICES_ONLY',catalogHash:digest(catalog),decisions,conceptBranches:expanded,requiredCapabilities:[...required],requiredRules:[...new Set([...chosen.keys()].flatMap(id=>catalog.decisionPoints.flatMap(p=>p.options).find(o=>o.id===id).validationRefs))]};
}
