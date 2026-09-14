import path from 'node:path';
import {campaign,storage,loadJSON,atomicJSON,digest,writerLease} from './factory.mjs';
import {fingerprint} from './assembly.mjs';

const indexPath=path.join(campaign,'goals/G02/candidate-index.json');
const performancePath=path.join(campaign,'goals/G03/independent-performance.json');
const output=path.join(campaign,'goals/G03/independent-comparison.json');
const traceOf=browser=>browser.rallyRuns??browser.flowRuns??browser.deliveryRuns??[];
const renderOf=(performance,id)=>performance.results.find(x=>x.id===id)?.render??null;
const visualDifferenceCount=(a,b)=>['kind','view','world','triangles','drawCalls','actorBounds','cameraRight','labelCount'].filter(key=>{
 if(key==='kind'||key==='view'||key==='world')return a.profile[key]!==b.profile[key];
 if(key==='triangles'||key==='drawCalls')return a.render?.[key]!==b.render?.[key];
 if(key==='actorBounds')return Boolean(a.render?.actorScreenBounds)!==Boolean(b.render?.actorScreenBounds);
 if(key==='cameraRight')return digest(a.render?.cameraRight)!==digest(b.render?.cameraRight);
 return (a.render?.worldLabels?.length??0)!==(b.render?.worldLabels?.length??0);
}).length;

export async function measureG03Comparison(){
 const index=await loadJSON(indexPath),source=await fingerprint(),performance=await loadJSON(performancePath);
 if(index.version!==8||index.status!=='NEEDS_REVIEW'||index.sourceHashes?.[0]!==source)throw Error('Current candidate index required');
 const entries=[];for(const candidate of index.candidates){const profile=await loadJSON(path.join(storage,candidate.id,'composition.json')),spine=await loadJSON(path.join(storage,candidate.id,'spine.json'));entries.push({id:candidate.id,kind:candidate.kind,view:candidate.view,world:profile.world,signature:candidate.signature,trace:traceOf(spine.browser),initialImageHash:spine.browser.initialHash??null,consequenceImageHash:spine.browser.screenshotHash??null,render:renderOf(performance,candidate.id),profile});}
 const comparisons=[];for(const a of entries)for(const b of entries)if(a.id<b.id)comparisons.push({a:a.id,b:b.id,interactionChanged:digest(a.trace)!==digest(b.trace),visualDifferenceCount:visualDifferenceCount(a,b),visualRequirementsMet:visualDifferenceCount(a,b)>=2});
 const report={version:1,goalId:'G03',status:'PROVISIONAL',sourceHash:source,method:'Independent pairwise comparison of actual automated traces, captures and render metrics',candidates:entries.map(({id,kind,view,world,signature,trace,initialImageHash,consequenceImageHash,render})=>({id,kind,view,world,signature,trace,initialImageHash,consequenceImageHash,render})),comparisons,interpretation:'This report records observable differences between current candidates under the same automated evidence process. It supports independent interaction and visual review but does not substitute for a reviewer comparing nearest neighbors, human comprehension, audio judgment, or target-device measurement.',created:Date.now()};const release=await writerLease('g03-comparison');try{await atomicJSON(output,report);return {report,ref:{path:'campaigns/reliable-arcade-factory/goals/G03/independent-comparison.json',sha256:digest(JSON.stringify(report,null,2)+'\n'),independent:true}};}finally{await release();}
}
