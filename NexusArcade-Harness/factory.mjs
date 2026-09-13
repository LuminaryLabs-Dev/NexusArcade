import {readFile,writeFile,rename,mkdir,open,unlink,realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
const root=path.dirname(fileURLToPath(import.meta.url));
export const packet=path.resolve(root,'../.agent/packets/2026-09-13_reliable-arcade-factory');
export const storage=path.resolve(root,'../NexusArcade-Experiments');
const canonical=x=>x&&typeof x==='object'?(Array.isArray(x)?x.map(canonical):Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])]))):x;
export const digest=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(canonical(x))).digest('hex');
export async function atomicJSON(file,value){await mkdir(path.dirname(file),{recursive:true});const temp=file+'.'+randomUUID()+'.tmp';try{await writeFile(temp,JSON.stringify(value,null,2)+'\n',{flag:'wx'});await rename(temp,file);}finally{await unlink(temp).catch(()=>{});}}
export async function loadJSON(file,fallback){try{return JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT'&&fallback!==undefined)return fallback;throw e;}}
export async function contracts(){const [queue,policy,catalog,profile]=await Promise.all(['goal-queue.json','execution-contract.json','master-catalog.json','game-profile.example.json'].map(f=>loadJSON(path.join(packet,f))));if(queue.goals.length!==33||queue.goals.reduce((n,g)=>n+g.acceptedGameTarget,0)!==1000)throw Error('Invalid goal sequence');for(let i=0;i<33;i++){const g=queue.goals[i];if(g.id!==`G${String(i+1).padStart(2,'0')}`||g.kind!==['plan','build','review'][i%3]||JSON.stringify(g.dependsOn)!==JSON.stringify(i?[queue.goals[i-1].id]:[]))throw Error('Invalid goal order');}if(policy.policy.ideaTimeLimitSeconds!==1500||policy.policy.totalTokenBudget!==null||policy.policy.improvementPassLimit!==null)throw Error('Unexpected factory policy');validateContractLinks(queue,policy,catalog,profile);return {queue,policy,catalog,profile,hash:digest({queue,policy,catalog,profile})};}
// All four specification files participate in evidence identity. A changed
// profile/rule cannot reuse readiness under the old three-file hash.
export function validateContractLinks(queue,policy,catalog,profile){
 const version=policy.schemaVersion;
 if([queue,catalog,profile].some(d=>d.schemaVersion!==version)||profile.acceptance.ruleVersion!==version)throw Error('Contract version mismatch');
 if(profile.catalog.version!==version||profile.catalog.hashEncoding!=='canonical-json'||profile.catalog.sha256!==digest(catalog)||profile.decisions.some(d=>d.origin.catalogVersion!==version))throw Error('Stale profile catalog reference');
 const rules=policy.validationRules.map(r=>r.id),required=policy.validationRules.filter(r=>r.required).map(r=>r.id),declared=profile.acceptance.requiredRuleIds;
 if(new Set(rules).size!==rules.length||new Set(declared).size!==declared.length||required.some(id=>!declared.includes(id))||declared.some(id=>!rules.includes(id)))throw Error('Profile validation coverage mismatch');
 if(!required.includes('replay'))throw Error('Missing mandatory replay validation');
 const calibrations=new Set(policy.calibrationDecisions.map(d=>d.id));
 for(const rule of policy.validationRules)if(rule.calibrationRef&&!calibrations.has(rule.calibrationRef))throw Error('Unknown calibration '+rule.calibrationRef);
 for(const point of catalog.decisionPoints)for(const option of point.options)if(option.validationRefs.some(id=>!rules.includes(id)))throw Error('Unknown catalog validation rule');
 for(const assertion of profile.acceptance.assertions)if(!rules.includes(assertion.ruleId))throw Error('Unknown profile assertion rule');
}
export function validateShape(value,schema,where='$'){
 if(schema.enum&&!schema.enum.includes(value))throw Error(`${where}: unknown value`);
 if(schema.type==='object'){if(!value||typeof value!=='object'||Array.isArray(value))throw Error(`${where}: expected object`);for(const key of schema.required??[])if(!Object.hasOwn(value,key))throw Error(`${where}: missing ${key}`);for(const [key,v] of Object.entries(value)){if(schema.additionalProperties===false&&!Object.hasOwn(schema.properties??{},key))throw Error(`${where}: unknown ${key}`);if(schema.properties?.[key])validateShape(v,schema.properties[key],where+'/'+key);}}
 if(schema.type==='array'){if(!Array.isArray(value)||value.length<(schema.minItems??0)||value.length>(schema.maxItems??Infinity))throw Error(`${where}: invalid array`);if(schema.uniqueItems&&new Set(value.map(digest)).size!==value.length)throw Error(`${where}: duplicate item`);for(const v of value)validateShape(v,schema.items??{},where+'/*');}
 if(schema.type==='string'&&(typeof value!=='string'||value.length<(schema.minLength??0)||value.length>(schema.maxLength??Infinity)))throw Error(`${where}: invalid string`);
 if(['number','integer'].includes(schema.type)&&(typeof value!=='number'||!Number.isFinite(value)||(schema.type==='integer'&&!Number.isInteger(value))||value<(schema.minimum??-Infinity)||value>(schema.maximum??Infinity)))throw Error(`${where}: invalid number`);
 if(schema.type==='boolean'&&typeof value!=='boolean')throw Error(`${where}: invalid boolean`);return value;
}
export function deadline(spine,signal,{now=Date.now,mono=()=>performance.now()}={}){const initial=now(),startMono=mono();let last=initial;if(!Number.isFinite(spine.started)||spine.deadline!==spine.started+1500000)throw Error('Invalid persisted deadline');const check=()=>{const t=now();if(t<last||t<spine.started)throw Error('CLOCK_ROLLBACK');last=t;if(signal?.aborted)throw Error('CANCELLED');if(t>=spine.deadline||initial+(mono()-startMono)>=spine.deadline)throw Error('DEADLINE_EXCEEDED');return spine.deadline-t;};return {check,remaining:check};}
export async function writerLease(id){await mkdir(storage,{recursive:true});const file=path.join(storage,'.writer.lock');let fd;try{fd=await open(file,'wx');}catch(e){if(e.code==='EEXIST')throw Error('Harness busy; inspect owner before recovery');throw e;}const token=randomUUID();await fd.writeFile(JSON.stringify({id,pid:process.pid,token,started:Date.now()}));await fd.close();return async()=>{const state=await loadJSON(file);if(state.token!==token)throw Error('Writer ownership changed');await unlink(file);};}
export async function recoverWriter(){const file=path.join(storage,'.writer.lock'),s=await loadJSON(file,null);if(!s)return {recovered:false};if(!Number.isInteger(s.pid)||s.pid<1||!/^[-a-zA-Z0-9_]+$/.test(s.id))throw Error('Invalid writer record');try{process.kill(s.pid,0);throw Error('Writer process is alive');}catch(e){if(e.code!=='ESRCH')throw e;}const verify=await loadJSON(file);if(JSON.stringify(s)!==JSON.stringify(verify))throw Error('Writer changed during recovery');const spineFile=path.join(storage,s.id,'spine.json'),spine=await loadJSON(spineFile,null);if(spine&&!['PASS','FAIL','CANCELLED'].includes(spine.status)){spine.status='FAIL';spine.error=Date.now()>=spine.deadline?'DEADLINE_EXCEEDED':'INTERRUPTED_PROCESS';spine.completed=Date.now();spine.elapsedMs=spine.completed-spine.started;await atomicJSON(spineFile,spine);}await unlink(file);return {recovered:true,id:s.id};}
export function invalidate(features,changed){const affected=new Set(changed);let more=true;while(more){more=false;for(const f of features)if(!affected.has(f.id)&&f.dependsOn.some(x=>affected.has(x))){affected.add(f.id);more=true;}}return features.map(f=>affected.has(f.id)?{...f,state:'invalidated',evidenceRefs:[]}:f);}
export function lockedFeatures(composition,sourceHash,rulesHash,evidence){const definitions=[['world',[],{nodes:composition.nodes,edges:composition.edges}],['movement',['world'],{speed:composition.speed}],['interaction',['world','movement'],composition.nodes.map(n=>({id:n.id,action:n.action,requires:n.requires,receiver:n.receiver}))],['objective',['interaction'],{required:composition.required,exit:composition.exit,duration:composition.duration}],['presentation',['world','interaction','objective'],{palette:composition.palette,style:composition.style,view:composition.view}]];return definitions.map(([id,dependsOn,config])=>({id,dependsOn,state:'verified_locked',implementationHash:sourceHash,configurationHash:digest(config),ruleVersion:rulesHash,evidenceRefs:evidence}));}
export function applyRepair(profile,proposal,{revision,editablePaths,checkIds,schema}){validateShape(proposal,schema);if(proposal.candidateRevision!==revision)throw Error('Stale repair revision');if(proposal.decision!=='propose'){if(proposal.changes.length)throw Error('Non-proposal contains changes');return profile;}if(!proposal.changes.length||!proposal.expectedCheckIds.length||proposal.expectedCheckIds.some(x=>!checkIds.includes(x)))throw Error('Missing or unknown affected checks');const out=structuredClone(profile),seen=new Set();for(const c of proposal.changes){if(c.op!=='replace_parameter'||!Object.hasOwn(editablePaths,c.path)||seen.has(c.path))throw Error('Protected or unsupported repair');seen.add(c.path);validateShape(c.value,editablePaths[c.path]);const keys=c.path.split('/').slice(1).map(x=>x.replaceAll('~1','/').replaceAll('~0','~'));if(keys.some(k=>['__proto__','prototype','constructor'].includes(k)))throw Error('Invalid path');let obj=out;for(const key of keys.slice(0,-1)){if(!Object.hasOwn(obj,key))throw Error('Unknown path');obj=obj[key];}if(!Object.hasOwn(obj,keys.at(-1)))throw Error('Unknown path');obj[keys.at(-1)]=c.value;}return out;}
export const campaign=path.join(storage,'campaigns/reliable-arcade-factory');
const indexFile=path.join(campaign,'accepted-index.json');
export async function acceptedIndex(){return loadJSON(indexFile,{version:1,revision:0,games:[]});}
async function serialized(name,fn){await mkdir(storage,{recursive:true});const file=path.join(storage,name+'.lock');const fd=await open(file,'wx');try{return await fn();}finally{await fd.close();await unlink(file);}}
export async function verifyEvidence(ref){
 if(!ref||typeof ref.path!=='string'||!/^([a-f0-9]{64})$/.test(ref.sha256??''))throw Error('Invalid evidence reference');
 const resolved=await realpath(path.resolve(storage,ref.path)),base=await realpath(storage);
 if(!resolved.startsWith(base+path.sep))throw Error('Evidence outside experiment storage');
 const bytes=await readFile(resolved);if(digest(bytes)!==ref.sha256)throw Error('Stale evidence: '+ref.path);return bytes;
}
export async function publishAccepted(game,guard){return serialized('.accepted-index',async()=>{
 guard.check();const {policy,hash,queue}=await contracts(),state=await queueSnapshot();
 if(state.goals.slice(0,3).some(g=>g.status!=='complete'))throw Error('Foundation review incomplete');
 if(game.acceptance?.verdict!=='PASS'||game.acceptance.ruleVersion!==hash)throw Error('Unvalidated publication');
 const owner=queue.goals.find(g=>g.id===game.goalId&&g.kind==='build'&&g.acceptedGameTarget===100);
 if(!owner||state.goals.find(g=>g.id===owner.id)?.status!=='running')throw Error('No running batch owner');
 if(!Number.isInteger(game.slot)||game.slot<1||game.slot>owner.acceptedGameTarget||game.slotId!==owner.id+':'+game.slot)throw Error('Invalid slot');
 if(game.deadline!==game.started+1500000||Date.now()>=game.deadline||!game.artifactHash||!game.profileHash||!game.signature)throw Error('Invalid candidate identity/deadline');
 await verifyEvidence({path:game.artifactPath,sha256:game.artifactHash});await verifyEvidence({path:game.profilePath,sha256:game.profileHash});
 const ids=new Set();for(const check of game.acceptance.checks??[]){
  if(ids.has(check.checkId))throw Error('Duplicate validation check');ids.add(check.checkId);
  for(const key of policy.resultContract.requiredFields)if(!Object.hasOwn(check,key))throw Error('Incomplete check receipt: '+key);
  if(check.verdict!=='PASS'||check.artifactHash!==game.artifactHash||check.ruleVersion!==hash||check.candidateRevision!==game.candidateRevision||check.inputHash!==game.profileHash||check.startedAt<game.started||check.completedAt<check.startedAt||check.completedAt>=game.deadline||!check.evidenceRefs.length)throw Error('Stale or incomplete validation receipt');
  for(const ref of check.evidenceRefs)await verifyEvidence(ref);
 }
 if(policy.validationRules.some(r=>!ids.has(r.id)))throw Error('Missing mandatory validation');
 const index=await acceptedIndex();if(index.games.some(g=>g.id===game.id||!g.revoked&&(g.signature===game.signature||g.slotId===game.slotId)))throw Error('Duplicate accepted identity/signature/slot');
 guard.check();index.games.push({...game,publishedAt:Date.now()});index.revision++;await atomicJSON(indexFile,index);return index;
});}
export async function revoke(id,reason){if(typeof reason!=='string'||!reason.trim())throw Error('Revocation requires a reason');return serialized('.accepted-index',async()=>{
 const index=await acceptedIndex(),game=index.games.find(g=>g.id===id&&!g.revoked);if(!game)throw Error('Unknown active accepted game');
 // First invalidate readiness. A crash before index write remains conservative.
 await serialized('.factory-queue',async()=>{const file=path.join(campaign,'factory-queue.json'),state=await loadJSON(file,{goals:{}}),{queue}=await contracts();let affected=false;for(const goal of queue.goals){if(goal.id===game.goalId)affected=true;if(affected&&state.goals[goal.id]){state.goals[goal.id].status=goal.id===game.goalId?'needs_review':'blocked';state.goals[goal.id].findings=[{id:'revoked:'+id,reason}];}}await atomicJSON(file,state);});
 game.revoked={reason,at:Date.now()};index.revision++;await atomicJSON(indexFile,index);return game;
});}
export async function queueSnapshot(){const {queue,hash}=await contracts(),state=await loadJSON(path.join(campaign,'factory-queue.json'),{contractHash:hash,goals:{}});return {...state,contractHash:hash,goals:queue.goals.map(g=>({...g,status:state.contractHash!==hash&&state.goals[g.id]?'blocked':state.goals[g.id]?.status??'planned',execution:state.goals[g.id]??null}))};}
export async function recordGoal(id,status,{evidence=[],findings=[],checks=[]}={}){return serialized('.factory-queue',async()=>{
 const {queue,policy,hash}=await contracts(),goal=queue.goals.find(g=>g.id===id);if(!goal)throw Error('Unknown goal');
 const file=path.join(campaign,'factory-queue.json'),state=await loadJSON(file,{contractHash:hash,goals:{}}),old=state.goals[id]?.status??'planned';
 if(state.contractHash!==hash){if(status!=='blocked')throw Error('Contract changed; revalidate readiness');for(const prior of Object.values(state.goals))if(prior.status!=='planned')prior.status='blocked';}
 if(!policy.queue.transitions[old]?.includes(status))throw Error('Invalid goal transition: '+old+' -> '+status);
 if(['ready','running','complete'].includes(status)){
  if(findings.length)throw Error('Unresolved findings');for(const dep of goal.dependsOn)if(state.goals[dep]?.status!=='complete')throw Error('Prior goal incomplete');
  if(!evidence.length)throw Error('Missing phase evidence');for(const ref of evidence)await verifyEvidence(ref);
 }
 if(status==='ready'){
  const readiness=JSON.parse(await verifyEvidence(evidence[0]));const unresolved=goal.kind==='plan'?readiness.unresolvedInputs:readiness.unresolved;if(readiness.goalId!==id||readiness.contractHash!==hash||readiness.status!=='READY'||!Array.isArray(unresolved)||unresolved.length||!readiness.orderedWork?.length)throw Error('Invalid readiness packet');
 }
 if(status==='complete'){
  for(const requirement of goal.acceptanceChecks){const check=checks.find(c=>c.id===requirement.id);if(!check||check.verdict!=='PASS'||check.contractHash!==hash||!check.evidenceRefs?.length)throw Error('Missing phase check: '+requirement.id);for(const ref of check.evidenceRefs)await verifyEvidence(ref);}
  if(goal.acceptedGameTarget){const active=(await acceptedIndex()).games.filter(g=>!g.revoked&&g.goalId===id);if(active.length!==goal.acceptedGameTarget||new Set(active.map(g=>g.slotId)).size!==active.length)throw Error('Batch slots incomplete');}
 }
 const previous=state.goals[id];state.goals[id]={status,evidence,findings,checks,updated:Date.now(),history:[...(previous?.history??[]),{from:old,to:status,at:Date.now()}]};state.contractHash=hash;await atomicJSON(file,state);return state.goals[id];
});}
