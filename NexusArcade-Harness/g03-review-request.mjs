import path from 'node:path';
import {campaign,loadJSON,atomicJSON,writerLease,digest} from './factory.mjs';
import {fingerprint} from './assembly.mjs';

const indexPath=path.join(campaign,'goals/G02/candidate-index.json');
const manifestPath=path.join(campaign,'goals/G03/evidence-manifest.json');
const output=path.join(campaign,'goals/G03/review-request-current.json');

export async function writeG03ReviewRequest(){
 const index=await loadJSON(indexPath),manifest=await loadJSON(manifestPath),source=await fingerprint();
 if(index.version!==8||index.status!=='NEEDS_REVIEW'||index.sourceHashes?.length!==1||index.sourceHashes[0]!==source)throw Error('Candidate index is stale or incomplete');
 if(manifest.sourceHash!==source)throw Error('G03 evidence manifest is stale');
 const availableEvidence=(manifest.independentSuites??[]).map(s=>s.evidenceRef).filter(Boolean).map(({path,independent})=>({path,independent}));
 const request={version:4,goalId:'G03',status:'AWAITING_INDEPENDENT_REVIEW',purpose:'Current review request; does not accept, revoke, or count any game.',sourceHash:source,candidateIndex:{path:'campaigns/reliable-arcade-factory/goals/G02/candidate-index.json',sha256:digest(JSON.stringify(index,null,2)+'\n')},candidates:index.candidates.map(c=>({id:c.id,kind:c.kind,view:c.view,conceptIntent:c.conceptIntent,availableEvidence})),reviewerInstructions:{independence:'Use a reviewer and evidence path separate from generation claims. Evidence must be marked independent:true in the submitted verdict.',facets:{conceptCausality:'Disable or perturb each claimed concept effect and record the changed decision, state or outcome.',interactionNovelty:'Compare paired traces against five nearest behavior neighbors and record a consequential difference.',visualNovelty:'Compare actual captures against five nearest visual neighbors; require two non-color differences.',presentationAudio:'Review first action, consequence, ending, crowded frame, audio output, mute and reduced effects.',targetDevice:'Run the exact candidate on the declared target device and record viewport, frame pacing, memory and errors.',comprehension:'Have a human identify objective, action, target, consequence, success/failure and restart without generator assistance.'}},submission:{command:'node NexusArcade-Harness/cli.mjs candidate-review --file <completed-review.json>',requiredFacetVerdicts:['PASS','FAIL','NEEDS_REVIEW'],evidenceRequiredPerFacet:true},nextAction:'Complete six facet verdicts for all three current candidates using exact target-device and human observations; submit only through candidate-review.mjs.',created:Date.now()};
 const release=await writerLease('g03-review-request');try{await atomicJSON(output,request);return {request,ref:{path:'campaigns/reliable-arcade-factory/goals/G03/review-request-current.json',sha256:digest(JSON.stringify(request,null,2)+'\n')}};}finally{await release();}
}
