import {readFile} from 'node:fs/promises';
import {digest,validateShape} from './factory.mjs';
import {inspectCatalog,resolveCatalog} from './catalog.mjs';
import {compileDomainComposition} from './kits/domain-composition.mjs';
import {domainDefinitions} from './kits/domain-graph.mjs';
import {assertAllowedText} from './text-policy.mjs';

const bindings=JSON.parse(await readFile(new URL('./domain-bindings.json',import.meta.url)));
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const same=(a,b)=>digest(a)===digest(b);
function optionsById(catalog){
 const choices=new Map();
 for(const point of catalog.decisionPoints)for(const option of point.options){
  if(choices.has(option.id))throw Error('Ambiguous catalog option '+option.id);choices.set(option.id,{point,option});
  const walk=nodes=>{for(const node of nodes??[])if(node.kind==='interpretation_choice')for(const branch of node.options){if(choices.has(branch.id))throw Error('Ambiguous catalog branch '+branch.id);choices.set(branch.id,{point,option,branch,choice:node});walk(branch.children);}};walk(option.children);
 }
 return choices;
}

// Compile selected behavior layers while leaving world/presentation/device and
// admission work explicit. This entry point never grants factory eligibility.
export function compileCatalogBehavior(catalog,profile){
 assertAllowedText(profile);
 inspectCatalog(catalog);
 if(!exact(profile,['version','seed','specificIntent','preparedInterpretation','decisions','conceptBranches','domainInstances','connections','objective'])||profile.version!==1||!Number.isInteger(profile.seed)||profile.seed<0||profile.seed>4294967295||typeof profile.specificIntent!=='string'||!profile.specificIntent.trim()||profile.specificIntent.length>1000||typeof profile.preparedInterpretation!=='string'||!profile.preparedInterpretation.trim()||profile.preparedInterpretation.length>1000||!Array.isArray(profile.decisions)||!Array.isArray(profile.conceptBranches))throw Error('Invalid behavior profile');
 const choices=optionsById(catalog),selected=new Map(),branches=new Map(),visitedBranches=new Set();
 for(const d of profile.decisions){
  if(!exact(d,['pointId','optionId','parameters']))throw Error('Invalid behavior decision');
  const entry=choices.get(d.optionId);if(!entry||entry.branch||entry.point.id!==d.pointId||selected.has(d.optionId))throw Error('Unknown or duplicate behavior option');
  const parameters={};validateShape(d.parameters,{type:'object',properties:entry.option.parameters,additionalProperties:false});
  for(const [key,schema]of Object.entries(entry.option.parameters)){parameters[key]=d.parameters[key]??schema.default;validateShape(parameters[key],schema,key);}
  selected.set(d.optionId,{...entry,parameters});
 }
 for(const point of catalog.decisionPoints){const count=[...selected.values()].filter(x=>x.point.id===point.id).length;if((count>0&&count<point.selection.min)||count>point.selection.max)throw Error('Behavior selection count mismatch '+point.id);}
 for(const id of profile.conceptBranches){const entry=choices.get(id);if(!entry?.branch||!selected.has(entry.option.id)||branches.has(id))throw Error('Unknown or unselected concept branch');branches.set(id,entry);}
 for(const [id,entry]of selected){
  if(entry.option.conflicts.some(x=>selected.has(x)||[...selected.values()].some(s=>s.option.requires.includes(x))))throw Error('Conflicting behavior option '+id);
  const walk=(nodes,depth)=>{for(const node of nodes??[])if(node.kind==='interpretation_choice'){if(depth<=0)throw Error('Unresolved concept depth');const picked=node.options.filter(x=>branches.has(x.id));if(picked.length!==node.select)throw Error('Missing concept interpretation '+node.id);for(const branch of picked){visitedBranches.add(branch.id);walk(branch.children,depth-1);}}};walk(entry.option.children,entry.parameters.branchDepth??Infinity);
 }
 for(const id of branches.keys())if(!visitedBranches.has(id))throw Error('Interpretation has an unselected ancestor '+id);
 // All compatibility obligations involving these layers still apply. Required
 // presentation/world options are gaps here, never silently waived as satisfied.
 for(const rule of catalog.compatibilityRules)if(selected.has(rule.ifSelected)){
  if((rule.requiresSelected??[]).some(id=>!selected.has(id)))throw Error('Missing compatible behavior layer '+rule.id);
  if(rule.predicate)throw Error('Behavior predicate needs independent proof '+rule.id);
 }
 const compiled=compileDomainComposition({version:1,domainInstances:profile.domainInstances,connections:profile.connections,objective:profile.objective});
 const used=new Set(),parameterUse=new Set(),witnesses=[];
 for(const n of profile.domainInstances){
  if(!n.sourceOptionIds.length&&!bindings.infrastructure.includes(n.capabilityId))throw Error('Unattributed domain '+n.id);
  for(const source of n.sourceOptionIds){
   const entry=selected.get(source)??branches.get(source),binding=bindings.options[source];
   if(!entry||!binding||!binding.capabilities.includes(n.capabilityId))throw Error('Unsupported option-to-domain binding '+source+'/'+n.capabilityId);
   used.add(source);
   if(selected.has(source))for(const [key,value]of Object.entries(entry.parameters)){
    const target=binding.parameters[key]?.[n.capabilityId];
    if(target){if(!same(n.settings[target],value))throw Error('Selected parameter differs from behavior '+source+'/'+key);parameterUse.add(source+'/'+key);}
    else if(Object.hasOwn(binding.supportedConstants,key)){if(!same(value,binding.supportedConstants[key]))throw Error('Unsupported parameter behavior '+source+'/'+key);parameterUse.add(source+'/'+key);}
    else if(!Object.hasOwn(binding.parameters,key))throw Error('Unimplemented parameter '+source+'/'+key);
   }
   if(binding.witness){
    if(!domainDefinitions[n.capabilityId].outputs[binding.witness.port])throw Error('Unknown witness port');
    witnesses.push({conceptOptionId:entry.option.id,branchId:source,instanceId:n.id,...binding.witness,verdict:'REQUIRED'});
   }
  }
 }
 for(const [id,entry]of selected){
  if(entry.point.id==='concepts'){if(![...branches].some(([branch,b])=>b.option.id===id&&used.has(branch)&&witnesses.some(w=>w.branchId===branch)))throw Error('Concept has no executable witness '+id);}
  else{if(!used.has(id))throw Error('Selected layer has no implemented contribution '+id);for(const key of Object.keys(entry.parameters))if(!parameterUse.has(id+'/'+key))throw Error('Unused selected parameter '+id+'/'+key);}
 }
 for(const id of branches.keys())if(!used.has(id))throw Error('Unused interpretation branch '+id);
 const requiredCapabilities=[...new Set([...selected.values()].flatMap(e=>e.option.requires).concat([...branches.values()].flatMap(e=>e.branch.requires??[])))];
 const requiredRules=[...new Set([...selected.values()].flatMap(e=>e.option.validationRefs))];
 const unresolvedGamePoints=catalog.decisionPoints.filter(p=>p.selection.min>0&&![...selected.values()].some(e=>e.point.id===p.id)).map(p=>p.id);
 return {status:'BEHAVIOR_COMPILED',eligible:false,fullGame:false,catalogHash:digest(catalog),bindingHash:digest(bindings),profileHash:digest(profile),seed:profile.seed,specificIntent:profile.specificIntent,preparedInterpretation:profile.preparedInterpretation,...compiled,requiredCapabilities,requiredRules,unresolvedGamePoints,requiredWitnesses:witnesses,remaining:'Behavior compilation alone does not establish spatial reachability, concept causality, presentation, replay, novelty, device performance or game qualification.'};
}

// Eligible production choices must still pass the existing source/evidence gate.
// Even then, the returned behavior is only one part of the complete game.
export async function compileEligibleCatalogBehavior(catalog,profile,options){
 const byId=optionsById(catalog),branches={};for(const id of profile.conceptBranches){const entry=byId.get(id);if(!entry?.branch)throw Error('Unknown interpretation');(branches[entry.choice.id]??=[]).push(id);}
 const resolved=await resolveCatalog(catalog,profile.decisions,{...options,branches});
 return {...compileCatalogBehavior(catalog,profile),resolved};
}
