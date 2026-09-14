import path from 'node:path';
import {campaign,loadJSON,atomicJSON,digest,writerLease} from './factory.mjs';
import {fingerprint} from './assembly.mjs';
const indexPath=path.join(campaign,'goals/G02/candidate-index.json');
const output=path.join(campaign,'goals/G03/review-template-current.json');
const facets=['conceptCausality','interactionNovelty','visualNovelty','presentationAudio','targetDevice','comprehension'];
export async function writeG03ReviewTemplate(){
 const index=await loadJSON(indexPath),source=await fingerprint();
 if(index.version!==8||index.status!=='NEEDS_REVIEW'||index.sourceHashes?.[0]!==source)throw Error('Current candidate index required');
 const candidates=index.candidates.map(c=>{const review={id:c.id};for(const f of facets)review[f]={verdict:'NEEDS_REVIEW',evidenceRefs:[]};review.targetDevice.deviceProfile='';review.comprehension.observerType='human';return review;});
 const facetInstructions={conceptCausality:'Perturb or remove each claimed concept effect and record a changed decision, state or outcome.',interactionNovelty:'Compare paired interaction traces with five nearest behavior neighbors and record a consequential difference.',visualNovelty:'Compare actual captures with five nearest visual neighbors and require two non-color differences.',presentationAudio:'Review first action, consequence, ending, crowded frame, audio output, mute and reduced-effects behavior.',targetDevice:'Run the exact candidate on the named target device and record viewport, frame pacing, memory and errors.',comprehension:'Have a human identify objective, action, target, consequence, success/failure and restart without generator assistance.'};
 const template={version:1,goalId:'G03',reviewerId:'',sourceHash:source,candidateIndex:{path:'campaigns/reliable-arcade-factory/goals/G02/candidate-index.json',sha256:digest(JSON.stringify(index,null,2)+'\n')},facetInstructions,evidencePolicy:'Every evidenceRefs entry must be independently produced, marked independent:true, and point to a named artifact under the G03 independent evidence area. NEEDS_REVIEW is valid when evidence is incomplete; PASS requires direct proof.',candidates,submission:'Fill reviewerId and every facet with independent evidence under G03, then submit via cli.mjs candidate-review. This scaffold is intentionally incomplete and cannot be submitted.'};
 const release=await writerLease('g03-review-template');try{await atomicJSON(output,template);return {template,ref:{path:'campaigns/reliable-arcade-factory/goals/G03/review-template-current.json',sha256:digest(JSON.stringify(template,null,2)+'\n')}};}finally{await release();}
}
