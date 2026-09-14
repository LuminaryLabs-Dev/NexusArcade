import path from 'node:path';
import {campaign,loadJSON,atomicJSON,digest,writerLease,contracts} from './factory.mjs';
import {fingerprint} from './assembly.mjs';

const requestPath=path.join(campaign,'goals/G03/review-request-current.json');
const output=path.join(campaign,'goals/G03/execution-packet.json');
export async function writeG03Readiness(){
 const request=await loadJSON(requestPath),source=await fingerprint(),{hash:contractHash}=await contracts();
 if(request.sourceHash!==source||request.status!=='AWAITING_INDEPENDENT_REVIEW')throw Error('Review request is stale or not awaiting review');
 const packet={version:1,goalId:'G03',contractHash,status:'READY',unresolved:[],orderedWork:[
  {id:'G03.freeze',scope:['current G02 candidate index','current G03 evidence manifest','current review request'],operation:'Freeze source-bound review inputs and verify every referenced artifact.',output:'review-input-lock.json',checks:['G03.review-independent']},
  {id:'G03.review',scope:['three foundation candidates','independent suites','human review fields'],operation:'Run independent review and record PASS/FAIL per facet without trusting generator claims.',output:'review-verdict.json',checks:['G03.review-count','G03.review-no-relaxation']},
  {id:'G03.reconcile',scope:['queue state','candidate lineage','open findings'],operation:'Reconcile verdicts; keep pilots outside accepted count and block downstream goals until all mandatory facets pass.',output:'evidence-manifest.json',checks:['G03.review-independent','G03.review-count','G03.review-no-relaxation']}
 ],inputs:{reviewRequest:{path:'campaigns/reliable-arcade-factory/goals/G03/review-request-current.json',sha256:digest(JSON.stringify(request,null,2)+'\n')},sourceHash:source},nextAction:'Complete independent review evidence, then record the three G03 review checks.'};
 const release=await writerLease('g03-readiness');try{await atomicJSON(output,packet);return {packet,ref:{path:'campaigns/reliable-arcade-factory/goals/G03/execution-packet.json',sha256:digest(JSON.stringify(packet,null,2)+'\n')}};}finally{await release();}
}
