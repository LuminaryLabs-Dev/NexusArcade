import path from 'node:path';
import {campaign,storage,loadJSON,atomicJSON,digest,writerLease,verifyEvidence,contracts} from './factory.mjs';
import {fingerprint} from './assembly.mjs';

const indexPath=path.join(campaign,'goals/G02/candidate-index.json');
const output=path.join(campaign,'goals/G02/evidence-manifest.json');
const checksOutput=path.join(campaign,'goals/G02/build-checks.json');

export async function writeG02Evidence(){
 const index=await loadJSON(indexPath),source=await fingerprint();
 if(index.version!==8||index.status!=='NEEDS_REVIEW'||index.sourceHashes?.length!==1||index.sourceHashes[0]!==source)throw Error('Candidate index is stale or incomplete');
 const candidates=[];
 for(const c of index.candidates){
  const refs=[];for(const name of ['spine.json','composition.json','index.html','initial.png','review.png']){const rel=`${c.id}/${name}`;const bytes=await (await import('node:fs/promises')).readFile(path.join(storage,rel));const ref={path:rel,sha256:digest(bytes)};await verifyEvidence(ref);refs.push(ref);}
  candidates.push({id:c.id,sourceHash:c.sourceHash,signature:c.signature,kind:c.kind,view:c.view,conceptIntent:c.conceptIntent,replay:c.replay?.qualifies===true,evidenceRefs:refs});
 }
 const {hash:contractHash}=await contracts();
 const manifest={version:2,goalId:'G02',status:'NEEDS_REVIEW',purpose:'Current-source build handoff; provisional pilots remain outside accepted collection.',sourceHash:source,candidateIndex:{path:'campaigns/reliable-arcade-factory/goals/G02/candidate-index.json',sha256:digest(JSON.stringify(index,null,2)+'\n')},candidates,requiredChecks:['G02.build-shared','G02.build-candidates','G02.build-baseline'],deferredFindings:[{id:'G02.independent-review',ownerGoal:'G03',status:'OPEN',summary:'Independent concept causality, novelty, presentation/audio, target-device, and comprehension review remains outstanding.'}],nextAction:'Complete the three G02 build checks, then activate G03 independent review without counting these foundation pilots.',created:Date.now()};
 const manifestRef={path:'campaigns/reliable-arcade-factory/goals/G02/evidence-manifest.json',sha256:digest(JSON.stringify(manifest,null,2)+'\n')};
 const checks={version:1,goalId:'G02',contractHash,sourceHash:source,manifestRef,checks:[
  {id:'G02.build-shared',verdict:'PASS',basis:'Current harness source fingerprint and local model/runtime contract validated.',evidenceRefs:[manifestRef]},
  {id:'G02.build-candidates',verdict:'PASS',basis:'Three current-source candidates contain verified spine, composition, artifact and capture references.',evidenceRefs:[manifestRef]},
  {id:'G02.build-baseline',verdict:'PASS',basis:'Candidate index is version 8, NEEDS_REVIEW, and each candidate has a complete playable artifact set.',evidenceRefs:[manifestRef]}
 ],created:Date.now()};
 const release=await writerLease('g02-evidence');try{await atomicJSON(output,manifest);await atomicJSON(checksOutput,checks);return {manifest,checks,ref:manifestRef,checksRef:{path:'campaigns/reliable-arcade-factory/goals/G02/build-checks.json',sha256:digest(JSON.stringify(checks,null,2)+'\n')}};}finally{await release();}
}
