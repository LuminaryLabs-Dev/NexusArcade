import path from 'node:path';
import {campaign,storage,loadJSON,atomicJSON,digest,writerLease,verifyEvidence} from './factory.mjs';
import {fingerprint} from './assembly.mjs';

const frozenSource=path.join(campaign,'goals/G02/evidence-manifest.json');
const output=path.join(campaign,'goals/G03/evidence-manifest.json');
const indexPath=path.join(campaign,'goals/G02/candidate-index.json');
const facets=['concept causality','interaction novelty','visual novelty','presentation and audio','target-device performance','human comprehension'];
export async function writeG03Evidence(){
 const index=await loadJSON(indexPath),source=await fingerprint();
 if(index.version!==8||index.status!=='NEEDS_REVIEW'||index.sourceHashes?.length!==1||index.sourceHashes[0]!==source)throw Error('Candidate index is stale or incomplete');
 if(index.candidates.length<3||!index.distinctSignatures)throw Error('G03 requires three distinct current candidates');
 for(const c of index.candidates){for(const name of ['spine.json','composition.json','initial.png','review.png']){const rel=`${c.id}/${name}`;await verifyEvidence({path:rel,sha256:digest(await (await import('node:fs/promises')).readFile(path.join(storage,rel)))});}}
 const prior=await loadJSON(frozenSource),frozenCases=prior.frozenCases??{};
 for(const value of Object.values(frozenCases)){const refs=value?.path?[value]:Array.isArray(value?.evidenceRefs)?value.evidenceRefs:(value?.evidenceRefs?[value.evidenceRefs]:[]);for(const ref of refs){if(ref?.path&&ref?.sha256)await verifyEvidence(ref);}}
 const manifest={version:2,goalId:'G03',status:'AWAITING_INDEPENDENT_REVIEW',purpose:'Current-source evidence handoff; it does not accept, revoke or count a game.',sourceHash:source,candidateIndex:{path:'campaigns/reliable-arcade-factory/goals/G02/candidate-index.json',sha256:digest(JSON.stringify(index,null,2)+'\n')},candidates:index.candidates.map(c=>({id:c.id,sourceHash:c.sourceHash,signature:c.signature,kind:c.kind,view:c.view,visualOrganization:c.visualOrganization,conceptIntent:c.conceptIntent,replay:c.replay?.qualifies===true})),frozenCases,requiredFacets:facets,openFindings:facets.map(f=>({facet:f,status:'OPEN',owner:'independent-reviewer'})),integrity:{candidateArtifacts:'PASS',frozenCaseReferences:'PASS',sourceConsistency:'PASS'},nextAction:'Complete independent facet evidence for all current candidates, then submit candidate-review.mjs. Human comprehension and target-device evidence cannot be inferred from automated previews.'};
 const release=await writerLease('g03-evidence');try{await atomicJSON(output,manifest);return {manifest,ref:{path:'campaigns/reliable-arcade-factory/goals/G03/evidence-manifest.json',sha256:digest(JSON.stringify(manifest,null,2)+'\n')}};}finally{await release();}
}
