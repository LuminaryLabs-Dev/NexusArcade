import path from 'node:path';
import {campaign,storage,loadJSON,atomicJSON,digest,writerLease} from './factory.mjs';
import {fingerprint} from './assembly.mjs';
import {reviewPilot} from './pilot-review.mjs';

const indexPath=path.join(campaign,'goals/G02/candidate-index.json');
const output=path.join(campaign,'goals/G03/independent-presentation.json');
const required=['complete loop','audio feedback emits on consequential event','ending still renders','no browser errors'];
export async function measureG03Presentation(){
 const index=await loadJSON(indexPath),source=await fingerprint();if(index.version!==8||index.status!=='NEEDS_REVIEW'||index.sourceHashes?.[0]!==source)throw Error('Current candidate index required');
 const results=[];for(const candidate of index.candidates){const report=await reviewPilot(storage,candidate.id);const checks=Object.fromEntries(required.map(name=>[name,report.checks.find(x=>x.name===name)?.pass===true]));results.push({id:candidate.id,status:report.status,checks,initialHash:report.initialHash??null,screenshotHash:report.screenshotHash??(report.image?digest(report.image):null),detailHash:report.detailHash??(report.detailImage?digest(report.detailImage):null),frame:report.frame??null,errors:report.errors});}
 const report={version:1,goalId:'G03',status:'PROVISIONAL',sourceHash:source,method:'Independent repeat playthrough for presentation, feedback and ending evidence',results,interpretation:'Fresh automated playthroughs verify the declared gameplay feedback and ending checks and retain actual capture hashes. This supports presentation/audio review but does not replace human judgment of quality, accessibility, or target-device evidence.',created:Date.now()};const release=await writerLease('g03-presentation');try{await atomicJSON(output,report);return {report,ref:{path:'campaigns/reliable-arcade-factory/goals/G03/independent-presentation.json',sha256:digest(JSON.stringify(report,null,2)+'\n'),independent:true}};}finally{await release();}
}
