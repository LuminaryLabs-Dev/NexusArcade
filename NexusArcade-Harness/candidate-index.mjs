import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {storage,campaign,atomicJSON,loadJSON,digest,writerLease,verifyEvidence} from './factory.mjs';
import {fingerprint} from './assembly.mjs';

export async function buildCandidateIndex(ids){
 if(!Array.isArray(ids)||ids.length<3||ids.length>32||ids.some(id=>!/^\w[\w-]{0,70}$/.test(id)))throw Error('Candidate index needs 3-32 safe IDs');
 const candidates=[];
 for(const id of ids){
  const s=await loadJSON(path.join(storage,id,'spine.json'));
  if(s.id!==id||s.status!=='NEEDS_REVIEW'||s.previewVerdict!=='PASS')throw Error('Candidate is not a passing provisional preview: '+id);
  if(!s.sourceHash||!s.signature)throw Error('Candidate lacks source or structural identity: '+id);
  if(s.replay?.qualifies!==true)throw Error('Candidate lacks qualified replay evidence: '+id);
  candidates.push({id,sourceHash:s.sourceHash,status:s.status,previewVerdict:s.previewVerdict,signature:s.signature,kind:s.composition?.kind??'scene',replay:s.replay??null,acceptanceMissing:s.acceptance?.missing??[]});
 }
 const sourceHashes=[...new Set(candidates.map(c=>c.sourceHash))],signatures=new Set(candidates.map(c=>c.signature));
 if(sourceHashes.length!==1)throw Error('Candidate sources are inconsistent');
 if(signatures.size!==candidates.length)throw Error('Candidate structural signatures are duplicated');
 if(sourceHashes[0]!==await fingerprint())throw Error('Candidate source hash is stale');
 return {version:4,goalId:'G02',status:'NEEDS_REVIEW',purpose:'Current-source contrasting foundation candidates; provisional until independent review.',sourceHashes,sourceConsistent:sourceHashes.length===1,candidates,distinctSignatures:signatures.size===candidates.length,requiredReview:['independent concept contribution','comparative novelty rubric','target-device performance','human comprehension'],created:Date.now()};
}

export async function writeCandidateIndex(ids){
 const index=await buildCandidateIndex(ids),release=await writerLease('candidate-index');
 try{const file=path.join(campaign,'goals/G02/candidate-index.json');await atomicJSON(file,index);const ref={path:'campaigns/reliable-arcade-factory/goals/G02/candidate-index.json',sha256:digest(JSON.stringify(index,null,2)+'\n')};await verifyEvidence(ref);return {index,ref};}
 finally{await release();}
}
