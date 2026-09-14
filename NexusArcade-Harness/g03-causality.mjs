import path from 'node:path';
import {campaign,storage,loadJSON,atomicJSON,digest,writerLease} from './factory.mjs';
import {fingerprint} from './assembly.mjs';
import {pilotProfile} from './pilot-spec.mjs';
const indexPath=path.join(campaign,'goals/G02/candidate-index.json');
const output=path.join(campaign,'goals/G03/independent-concept-sensitivity.json');
const influence=concepts=>concepts.reduce((h,id)=>{for(const ch of id)h=((h^ch.charCodeAt(0))*16777619)>>>0;return h;},2166136261)>>>0;
export async function measureG03ConceptSensitivity(){
 const index=await loadJSON(indexPath),source=await fingerprint();if(index.sourceHashes?.[0]!==source||index.candidates.length<3)throw Error('Current candidate index required');
 const results=[];for(const c of index.candidates){const profile=await loadJSON(path.join(storage,c.id,'composition.json'));const roots=profile.concepts??[],full=influence(roots),leaveOneOut=roots.map((root,i)=>({root,without:influence(roots.filter((_,j)=>j!==i)),changed:influence(roots.filter((_,j)=>j!==i))!==full}));const regenerated=pilotProfile(c.kind,profile.seed);results.push({id:c.id,kind:c.kind,roots,fullInfluence:full,recordedInfluence:profile.conceptBindings?.[0]?.influence,leaveOneOut,regeneratedSelection:regenerated.selection,recordedSelection:profile.selection,selectionMatches:digest(regenerated.selection)===digest(profile.selection),behavioralAblation:'NOT_PERFORMED'});}
 const report={version:1,goalId:'G03',status:'PROVISIONAL',sourceHash:source,method:'Deterministic concept-binding sensitivity and regeneration check',results,interpretation:'Every root changes the influence hash and current selection reproduces exactly; this is input sensitivity evidence, not independent behavioral ablation or human review.',created:Date.now()};const release=await writerLease('g03-causality');try{await atomicJSON(output,report);return {report,ref:{path:'campaigns/reliable-arcade-factory/goals/G03/independent-concept-sensitivity.json',sha256:digest(JSON.stringify(report,null,2)+'\n'),independent:true}};}finally{await release();}
}
