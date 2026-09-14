import path from 'node:path';
import {storage,campaign,loadJSON,atomicJSON,writerLease,verifyEvidence,digest} from './factory.mjs';
import {fingerprint} from './assembly.mjs';

const FACETS=['conceptCausality','interactionNovelty','visualNovelty','presentationAudio','targetDevice','comprehension'];
const verdicts=new Set(['PASS','FAIL','NEEDS_REVIEW']);

export async function recordCandidateReview(input){
 if(!input||typeof input!=='object'||typeof input.reviewerId!=='string'||!input.reviewerId.trim())throw Error('Review requires reviewerId');
 if(/replace-with|path\/to/i.test(input.reviewerId))throw Error('Review contains placeholder reviewer identity');
 if(!Array.isArray(input.candidates)||input.candidates.length<3)throw Error('Review requires three candidates');
 const index=await loadJSON(path.join(campaign,'goals/G02/candidate-index.json'));
 if(index.version!==8||index.status!=='NEEDS_REVIEW')throw Error('Review requires current provisional candidate index');
 if(input.candidates.length!==index.candidates.length)throw Error('Review must cover every indexed candidate');
 const currentHash=await fingerprint();const ids=new Set();const reviews=[];
 for(const review of input.candidates){
  if(!review||typeof review.id!=='string'||ids.has(review.id))throw Error('Review candidate IDs must be unique');ids.add(review.id);
  const candidate=index.candidates.find(c=>c.id===review.id);if(!candidate)throw Error('Review candidate is absent from index: '+review.id);
 if(candidate.sourceHash!==currentHash)throw Error('Review candidate source is stale: '+review.id);
  const facets={};for(const facet of FACETS){const item=review[facet];if(!item||!verdicts.has(item.verdict)||!Array.isArray(item.evidenceRefs)||!item.evidenceRefs.length)throw Error(`Review facet ${facet} needs verdict and evidence: ${review.id}`);if(item.evidenceRefs.some(ref=>ref?.independent!==true))throw Error(`Review facet ${facet} needs explicitly independent evidence: ${review.id}`);if(item.evidenceRefs.some(ref=>{const evidencePath=String(ref?.path??'');return evidencePath.startsWith(review.id+'/')||evidencePath.endsWith('goals/G02/candidate-index.json');}))throw Error(`Review facet ${facet} cannot cite candidate-local or stale-index evidence: ${review.id}`);if(item.evidenceRefs.some(ref=>/replace-with|path\/to/i.test(String(ref?.path??''))))throw Error(`Review facet ${facet} contains placeholder evidence: ${review.id}`);if(facet==='comprehension'&&item.observerType!=='human')throw Error(`Comprehension review needs a human observer: ${review.id}`);if(facet==='targetDevice'&&(typeof item.deviceProfile!=='string'||!item.deviceProfile.trim()))throw Error(`Target-device review needs a device profile: ${review.id}`);if(facet==='targetDevice'&&/replace-with|path\/to/i.test(item.deviceProfile))throw Error(`Target-device review contains placeholder device profile: ${review.id}`);for(const ref of item.evidenceRefs)await verifyEvidence(ref);facets[facet]={verdict:item.verdict,evidenceRefs:item.evidenceRefs,...(facet==='comprehension'?{observerType:item.observerType}:{}),...(facet==='targetDevice'?{deviceProfile:item.deviceProfile.trim()}: {})};}reviews.push({id:review.id,sourceHash:candidate.sourceHash,signature:candidate.signature,facets});
 }
 if(ids.size!==index.candidates.length||index.candidates.some(candidate=>!ids.has(candidate.id)))throw Error('Review candidate set does not match index');
 const allPass=reviews.every(r=>FACETS.every(f=>r.facets[f].verdict==='PASS'));
 const verdict={version:1,goalId:'G03',status:allPass?'READY_FOR_G03_ADJUDICATION':'NEEDS_REVIEW',reviewerId:input.reviewerId.trim(),candidateIndex:{path:'campaigns/reliable-arcade-factory/goals/G02/candidate-index.json',sha256:digest(JSON.stringify(index,null,2)+'\n')},sourceHash:currentHash,candidates:reviews,created:Date.now(),nextAction:allPass?'G03 may adjudicate the complete evidence set; acceptance still requires queue transition and batch rules.':'Resolve every non-PASS facet with an independent review or return the candidate to G02.'};
 const release=await writerLease('candidate-review');try{const file=path.join(campaign,'goals/G03/review-verdict.json');await atomicJSON(file,verdict);return {verdict,ref:{path:'campaigns/reliable-arcade-factory/goals/G03/review-verdict.json',sha256:digest(JSON.stringify(verdict,null,2)+'\n')}};}finally{await release();}
}
