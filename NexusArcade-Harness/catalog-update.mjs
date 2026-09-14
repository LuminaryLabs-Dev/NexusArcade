import {readFile,open,unlink,mkdir,readdir} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {packet,storage,campaign,digest,loadJSON,atomicJSON,writerLease,validateContractLinks,inspectFoundationPlan,verifyEvidence} from './factory.mjs';
import {inspectCatalog} from './catalog.mjs';
import {assertAllowedText} from './text-policy.mjs';

const names=['goal-queue.json','execution-contract.json','master-catalog.json','game-profile.example.json'];
const keys=['queue','policy','catalog','profile'];
 const same=(a,b)=>a===undefined||b===undefined?a===b:digest(a)===digest(b);
const bundleHash=b=>digest(Object.fromEntries(keys.map(k=>[k,b[k]])));
const requireSame=(a,b,label)=>{if(!same(a,b))throw Error('Non-additive catalog change: '+label);};
const without=(x,fields)=>Object.fromEntries(Object.entries(x).filter(([k])=>!fields.includes(k)));

// Only append unqualified alternatives. Existing choices, bounds, ordering,
// rules, sources and requirements remain byte-for-byte equivalent as JSON.
export function planCatalogAddition(before,nextCatalog){
 assertAllowedText(nextCatalog);inspectCatalog(before.catalog,{validationRules:before.policy.validationRules});
 inspectCatalog(nextCatalog,{validationRules:before.policy.validationRules});
 const ids=new Set();
 const unique=x=>{if(ids.has(x.id))throw Error('Ambiguous catalog identity '+x.id);ids.add(x.id);};
 const walk=nodes=>{for(const n of nodes??[])if(n.kind==='interpretation_choice'){unique(n);for(const b of n.options){unique(b);walk(b.children);}}};
 for(const p of nextCatalog.decisionPoints)for(const o of p.options){unique(o);walk(o.children);}
 const additions=[];
 requireSame(without(before.catalog,['decisionPoints','capabilities']),without(nextCatalog,['decisionPoints','capabilities']),'catalog policy');
 const branch=(b)=>{
  if(b.status!=='planned'||typeof b.meaning!=='string'||!b.meaning.trim()||!Array.isArray(b.requires)||!b.requires.length||typeof b.requiredEvidence!=='string'||!b.requiredEvidence.trim()||b.implementationRefs?.length)throw Error('New interpretation must be planned with explicit requirements and evidence');
  for(const child of b.children??[])if(child.kind==='interpretation_choice')for(const b of child.options)branch(b);
 };
 const option=(o)=>{
  if(o.status!=='planned'||o.implementationRefs.length||!o.requires.length)throw Error('New option must remain planned and unqualified');
  for(const child of o.children)if(child.kind==='interpretation_choice')for(const b of child.options)branch(b);
 };
 function append(oldList,newList,label,visit,added){
  if(!Array.isArray(newList)||newList.length<oldList.length)throw Error('Catalog deletion: '+label);
  oldList.forEach((old,i)=>visit(old,newList[i],label+'/'+old.id));
  for(const item of newList.slice(oldList.length)){added(item);additions.push({path:label,id:item.id});}
 }
 function children(oldList,newList,label){
  if(oldList.length!==newList.length)throw Error('Changed expansion structure: '+label);
  oldList.forEach((old,i)=>{
   const next=newList[i];
   if(old.kind!=='interpretation_choice'){requireSame(old,next,label);return;}
   requireSame(without(old,['options']),without(next,['options']),label);
   append(old.options,next.options,label+'/'+old.id,(a,b,p)=>{
    requireSame(without(a,['children']),without(b,['children']),p);
    children(a.children??[],b.children??[],p);
   },branch);
  });
 }
 if(before.catalog.decisionPoints.length!==nextCatalog.decisionPoints.length)throw Error('Changed decision point sequence');
 before.catalog.decisionPoints.forEach((old,i)=>{
  const next=nextCatalog.decisionPoints[i];
  requireSame(without(old,['options']),without(next,['options']),old.id);
  append(old.options,next.options,'decisionPoints/'+old.id,(a,b,p)=>{
   requireSame(without(a,['children']),without(b,['children']),p);children(a.children,b.children,p);
  },option);
 });
 for(const [id,cap]of Object.entries(before.catalog.capabilities))requireSame(cap,nextCatalog.capabilities[id],'capability/'+id);
 for(const [id,cap]of Object.entries(nextCatalog.capabilities))if(!Object.hasOwn(before.catalog.capabilities,id)){
  if(cap.status!=='missing'||!Array.isArray(cap.implementationRefs)||cap.implementationRefs.length||!before.queue.goals.some(g=>g.id===cap.ownerGoal)||typeof cap.gapResolution!=='string'||!cap.gapResolution.trim())throw Error('New capability must remain an explicit unresolved gap');
  additions.push({path:'capabilities',id});
 }
 if(!additions.length)throw Error('No catalog additions');
 const after=structuredClone(Object.fromEntries(keys.map(k=>[k,before[k]])));after.catalog=structuredClone(nextCatalog);after.profile.catalog.sha256=digest(nextCatalog);
 validateContractLinks(after.queue,after.policy,after.catalog,after.profile);
 return {version:1,scope:'unqualified catalog additions; no game or capability evidence migration',from:bundleHash(before),to:bundleHash(after),additions,after};
}

// This migration is intentionally limited to the unaccepted foundation. Later
// accepted games require dependency-scoped qualification, never hash relabeling.
export function planFoundationCatalogQueue(state,plan,receiptRef){
 if(state.contractHash!==plan.from)throw Error('Queue is not on the expected contract');
 for(const [id,g]of Object.entries(state.goals))if(g.status!=='planned'&&!(id==='G01'&&g.status==='complete')&&!(id==='G02'&&['running','needs_review','blocked'].includes(g.status)))throw Error('Catalog migration requires unfinished foundation');
 const next=structuredClone(state);next.contractHash=plan.to;
 (next.catalogUpdates??=[]).push({from:plan.from,to:plan.to,evidence:receiptRef});
 return next;
}

async function readBundle(dir){return Object.fromEntries(await Promise.all(names.map(async(n,i)=>[keys[i],await loadJSON(path.join(dir,n))])));}
const context=()=>({packet,storage,campaign});
async function lock(ctx,fn){
 // Fixtures use an isolated root; production shares the existing writer lease.
 let release;
 if(ctx.storage===storage)release=await writerLease('catalog-update');
 else {await mkdir(ctx.storage,{recursive:true});const f=path.join(ctx.storage,'.writer.lock'),fd=await open(f,'wx');await fd.writeFile(JSON.stringify({id:'catalog-update',pid:process.pid,token:randomUUID()}));await fd.close();release=()=>unlink(f);}
 const handles=[];
 try{
  const owner=await loadJSON(path.join(ctx.storage,'.writer.lock'));
  for(const name of ['.accepted-index.lock','.factory-queue.lock']){const f=path.join(ctx.storage,name),fd=await open(f,'wx');handles.push({f,fd});await fd.writeFile(JSON.stringify(owner));}
  return await fn();
 }finally{for(const {f,fd}of handles.reverse()){await fd.close();await unlink(f);}await release();}
}
async function evidence(ctx,ref){
 if(ctx.storage===storage)return verifyEvidence(ref);
 // Fixture evidence uses the same hash and containment contract.
 const f=path.resolve(ctx.storage,ref.path);if(!f.startsWith(path.resolve(ctx.storage)+path.sep))throw Error('Evidence outside fixture');
 const bytes=await readFile(f);if(digest(bytes)!==ref.sha256)throw Error('Stale fixture evidence');return bytes;
}
async function checkFoundation(ctx,state,before){
 const index=await loadJSON(path.join(ctx.campaign,'accepted-index.json'),{games:[]});
 if(index.games.length)throw Error('Accepted history requires scoped qualification migration');
 const dirs=await readdir(ctx.storage,{withFileTypes:true});
 for(const dir of dirs)if(dir.isDirectory()&&!dir.name.startsWith('.')){
  const s=await loadJSON(path.join(ctx.storage,dir.name,'spine.json'),null);
  if(s&&Number.isFinite(s.deadline)&&s.deadline>Date.now())throw Error('Wait for admitted idea windows to close before catalog migration');
 }
 for(const [id,g]of Object.entries(state.goals)){
  for(const ref of g.evidence??[])await evidence(ctx,ref);
  for(const c of g.checks??[])for(const ref of c.evidenceRefs??[])await evidence(ctx,ref);
  if(id==='G01'&&g.status==='complete'){
   const proof=JSON.parse(await evidence(ctx,g.evidence[0]));
   // A prior additive receipt preserves this original planning identity.
   const original=state.catalogUpdates?.[0]?.from??state.contractHash;
   inspectFoundationPlan(proof,before.policy,original);
   for(const check of before.queue.goals[0].acceptanceChecks)if(!g.checks.some(c=>c.id===check.id&&c.verdict==='PASS'&&c.contractHash===original&&c.evidenceRefs?.length))throw Error('Incomplete original foundation planning evidence');
  }
 }
 await verifyCatalogUpdateHistory(state,before,{ctx});
}

export async function verifyCatalogUpdateHistory(state,bundle,{ctx=context()}={}){
 let target=bundle;
 if(state.catalogUpdates?.length&&state.contractHash!==bundleHash(bundle))throw Error('Catalog update history does not reach current queue');
 for(const update of [...state.catalogUpdates??[]].reverse()){
  const receipt=JSON.parse(await evidence(ctx,update.evidence));
  const plan=planCatalogAddition(receipt.before,target.catalog);
  if(receipt.from!==update.from||receipt.to!==update.to||plan.from!==update.from||plan.to!==update.to||bundleHash(target)!==plan.to||receipt.originalQueue.contractHash!==plan.from)throw Error('Broken catalog update history');
  target=receipt.before;
 }
 return true;
}

export async function updateCatalog(nextCatalog,{expectedHash,ctx=context()}={}){
 return lock(ctx,async()=>{
  const pending=path.join(ctx.campaign,'catalog-update.pending.json');
  if(await loadJSON(pending,null))throw Error('Resume the pending catalog update first');
  const before=await readBundle(ctx.packet),plan=planCatalogAddition(before,nextCatalog);
  if(plan.from!==expectedHash)throw Error('Stale expected contract hash');
  const state=await loadJSON(path.join(ctx.campaign,'factory-queue.json'));
  const receipt={version:1,scope:plan.scope,from:plan.from,to:plan.to,additions:plan.additions,before,originalQueue:state};
  const receiptFile=path.join(ctx.campaign,'catalog-updates',plan.to+'.json');
  const receiptBytes=JSON.stringify(receipt,null,2)+'\n',ref={path:path.relative(ctx.storage,receiptFile),sha256:digest(receiptBytes)};
  const nextState=planFoundationCatalogQueue(state,plan,ref);await checkFoundation(ctx,state,before);
  const existing=await loadJSON(receiptFile,null);if(existing&&!same(existing,receipt))throw Error('Catalog receipt already differs');
  if(!existing)await atomicJSON(receiptFile,receipt);
  // Durable intent precedes all authoritative changes. Unknown external edits
  // stop recovery; readers see a mismatch until all three files are installed.
  await atomicJSON(pending,{version:1,receipt:ref,nextCatalog,nextState});
  return applyPending(ctx);
 });
}
async function applyPending(ctx){
 const pendingFile=path.join(ctx.campaign,'catalog-update.pending.json'),p=await loadJSON(pendingFile);
 const receipt=JSON.parse(await evidence(ctx,p.receipt)),plan=planCatalogAddition(receipt.before,p.nextCatalog);
 if(plan.to!==receipt.to||plan.from!==receipt.from)throw Error('Invalid migration identity');
 requireSame(planFoundationCatalogQueue(receipt.originalQueue,plan,p.receipt),p.nextState,'recovery queue');
 await checkFoundation(ctx,receipt.originalQueue,receipt.before);
 const current=await readBundle(ctx.packet),state=await loadJSON(path.join(ctx.campaign,'factory-queue.json'));
 for(const k of keys)if(!same(current[k],receipt.before[k])&&!same(current[k],plan.after[k]))throw Error('Unexpected external edit during catalog recovery: '+k);
 if(!same(state,receipt.originalQueue)&&!same(state,p.nextState))throw Error('Unexpected queue change during catalog recovery');
 await atomicJSON(path.join(ctx.packet,'master-catalog.json'),plan.after.catalog);
 await atomicJSON(path.join(ctx.packet,'game-profile.example.json'),plan.after.profile);
 await atomicJSON(path.join(ctx.campaign,'factory-queue.json'),p.nextState);
 if(bundleHash(await readBundle(ctx.packet))!==plan.to)throw Error('Catalog update readback mismatch');
 await unlink(pendingFile);
 return {from:plan.from,to:plan.to,additions:plan.additions,receipt:p.receipt,preservedGoals:Object.entries(p.nextState.goals).map(([id,g])=>({id,status:g.status})),eligibilityChanged:false};
}
async function recoverCatalogLocks(ctx){
 const found=[];
 for(const name of ['.writer.lock','.accepted-index.lock','.factory-queue.lock']){
  const f=path.join(ctx.storage,name),owner=await loadJSON(f,null);if(!owner)continue;
  if(owner.id!=='catalog-update'||!Number.isInteger(owner.pid)||owner.pid<1||typeof owner.token!=='string'||!owner.token||found.some(x=>x.owner.token!==owner.token))throw Error('Unrelated or ambiguous lock; inspect its owner');
  try{process.kill(owner.pid,0);throw Error('Catalog update process is alive');}catch(e){if(e.code!=='ESRCH')throw e;}
  found.push({f,owner});
 }
 // Verify the complete set before removing anything. Never steal a live lease.
 for(const {f,owner}of found)requireSame(await loadJSON(f),owner,'recovery lock');
 for(const {f}of found.reverse())await unlink(f);
}
export async function resumeCatalogUpdate({ctx=context()}={}){
 if(!await loadJSON(path.join(ctx.campaign,'catalog-update.pending.json'),null))throw Error('No pending catalog update');
 await recoverCatalogLocks(ctx);return lock(ctx,()=>applyPending(ctx));
}
