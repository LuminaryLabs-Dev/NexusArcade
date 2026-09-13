import {digest,invalidate,applyRepair} from './factory.mjs';
// The caller supplies trusted build/review functions; model output remains data.
// One original deadline governs every revision. Candidates are never overwritten.
export async function improve({profile,features=[],guard,save,build,review,propose,repairContract}){
 let current=structuredClone(profile),best=null,revision=0,locks=structuredClone(features),lastFindings=[];
 const tried=new Set(),history=[];
 while(true){
  guard.check();const candidateHash=digest(current);
  if(tried.has(candidateHash))return finish('FAIL','REPEATED_CANDIDATE');
  tried.add(candidateHash);const candidate={revision:String(revision),profile:current,profileHash:candidateHash,features:locks};
  await save({status:'BUILDING',candidate,best,history});guard.check();
  const artifact=await build(candidate);guard.check();
  const result=await review({...candidate,artifact});guard.check();
  if(!Array.isArray(result.findings)||!Array.isArray(result.checks)||!result.checks.length)throw Error('Missing review evidence');
  if(result.profileHash!==candidateHash)throw Error('Review belongs to another candidate');
  for(const check of result.checks)if(!check.id||!['PASS','FAIL','NEEDS_REVIEW'].includes(check.verdict)||!check.evidenceHash)throw Error('Malformed check evidence');
  const checkIds=new Set(result.checks.map(x=>x.id));if(checkIds.size!==result.checks.length)throw Error('Duplicate review checks');
  const missing=repairContract.checkIds.filter(id=>!checkIds.has(id));if(missing.length)throw Error('Missing mandatory checks: '+missing.join(','));
  if(result.findings.some(f=>!f.id||!f.checkId||!checkIds.has(f.checkId)))throw Error('Untraceable finding');
  if(result.findings.some(f=>result.checks.find(c=>c.id===f.checkId).verdict==='PASS'))throw Error('Finding contradicts passing check');
  const failed=result.checks.filter(x=>x.verdict!=='PASS');
  if(failed.some(c=>!result.findings.some(f=>f.checkId===c.id)))throw Error('Failed check has no finding');
  const score=result.checks.filter(x=>x.verdict==='PASS').length;
  const protectedIds=new Set(best?.result.checks.filter(x=>x.verdict==='PASS').map(x=>x.id)??[]);
  const regression=failed.some(x=>protectedIds.has(x.id));
  const kept=!regression&&(!best||score>best.score);
  locks=locks.map(f=>{const ids=repairContract.checksByFeature?.[f.id]??[];const receipts=result.checks.filter(c=>ids.includes(c.id));return ids.length&&receipts.length===ids.length&&receipts.every(c=>c.verdict==='PASS')?{...f,state:'verified_locked',configurationHash:candidateHash,evidenceRefs:receipts.map(c=>c.evidenceHash)}:{...f,state:'needs_review',evidenceRefs:[]};});
  lastFindings=result.findings;
  history.push({revision,profileHash:candidateHash,artifact,result,kept});
  if(kept)best={revision,profile:structuredClone(current),profileHash:candidateHash,score,result,features:locks};
  if(!failed.length&&!result.findings.length){guard.check();return finish('PASS');}
  lastFindings=result.findings;
  // Revert to the verified baseline before requesting another supported change.
  if(!kept){current=structuredClone(best.profile);locks=structuredClone(best.features);lastFindings=best.result.findings;}
  await save({status:'REPAIRING',candidate,best,history});guard.check();
  const proposal=await propose({revision:String(revision),profile:current,findings:lastFindings,checks:kept?result.checks:best.result.checks,rejected:kept?null:{profileHash:candidateHash,findings:result.findings},allowedPaths:Object.keys(repairContract.editablePaths)});guard.check();
  if(proposal.decision!=='propose'){applyRepair(current,proposal,{...repairContract,revision:String(revision)});return finish('NEEDS_REVIEW','SUPPORTED_REPAIRS_EXHAUSTED');}
  if(!lastFindings.some(f=>f.id===proposal.findingId))throw Error('Repair targets unknown finding');
  const next=applyRepair(current,proposal,{...repairContract,revision:String(revision)});
  if(digest(next)===digest(current))return finish('FAIL','INEFFECTIVE_REPAIR');
  const affected=proposal.changes.flatMap(c=>repairContract.featuresByPath[c.path]??[]);
  if(!affected.length)throw Error('Repair has no declared feature impact');
  locks=invalidate(locks,affected);current=next;revision++;
 }
 async function finish(status,reason){guard.check();const result={status,reason,best,history,findings:lastFindings};await save(result);guard.check();return result;}
}
