import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {compilePlayableScene} from './scene-spec.mjs';
import {reviewScene} from './scene-review.mjs';
import {Models} from './model.mjs';
import {editorialSchema,interpretationSchema} from './composition.mjs';
import {reviewSchema} from './domains.mjs';
import {atomicJSON,writerLease,deadline,contracts,digest} from './factory.mjs';
import {build,experiments,fingerprint} from './assembly.mjs';
import {indexPreview} from './library.mjs';
import {assertAllowedText} from './text-policy.mjs';
export function validateSceneRetry(prior,profile,ruleVersion,reason){
 const intent=p=>digest({seed:p.scene.behavior.seed,specificIntent:p.scene.behavior.specificIntent,decisions:p.scene.behavior.decisions,conceptBranches:p.scene.behavior.conceptBranches,durationSeconds:p.scene.session.durationSeconds});
 if(prior.version!==4||!['FAIL','NEEDS_REVIEW','CANCELLED'].includes(prior.status)||prior.ruleVersion!==ruleVersion||!Number.isFinite(prior.started)||prior.deadline!==prior.started+1500000||intent(prior.profile)!==intent(profile))throw Error('Retry changed frozen intent, selections, clock or acceptance rules');
 if(prior.profileHash!==digest(profile)&&(typeof reason!=='string'||reason.trim().length<10||reason.length>300))throw Error('Changed profile requires an explicit repair reason');
 assertAllowedText(reason);return {priorProfileHash:prior.profileHash,reason:reason??null};
}
export async function generateScene({id,profile,retryOf,repairReason,signal,onProgress=()=>{}}){
 const validId=x=>typeof x==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,70}$/.test(x);if(!validId(id)||retryOf&&!validId(retryOf))throw Error('Invalid scene ID');
 const startingSourceHash=await fingerprint(),spec=await contracts(),compiled=compilePlayableScene(spec.catalog,profile),admittedAt=Date.now(),release=await writerLease(id);let s;
 try{
  let prior,revision=null;if(retryOf){prior=JSON.parse(await readFile(path.join(experiments,retryOf,'spine.json')));revision=validateSceneRetry(prior,profile,spec.hash,repairReason);}
  await mkdir(path.join(experiments,id));const started=prior?.started??admittedAt;s={version:4,purpose:'foundation-pilot',id,ideaId:prior?.ideaId??id,retryOf:retryOf??null,started,deadline:prior?.deadline??started+1500000,revisionCreated:Date.now(),seed:profile.scene.behavior.seed,profileHash:compiled.profileHash,profile,revision,compilation:{catalogHash:compiled.compilation.catalogHash,bindingHash:compiled.compilation.bindingHash,requiredWitnesses:compiled.compilation.requiredWitnesses,unresolvedGamePoints:compiled.compilation.unresolvedGamePoints},composition:compiled.composition,calls:[],status:'PLANNING',ruleVersion:spec.hash,admissionSourceHash:startingSourceHash};
  const guard=deadline(s,signal),combined=AbortSignal.any([AbortSignal.timeout(guard.remaining()),...(signal?[signal]:[])]),save=async()=>{guard.check();await atomicJSON(path.join(experiments,id,'spine.json'),s);onProgress({id,status:s.status,elapsedMs:Date.now()-started});};await save();const models=new Models(s,save,{signal:combined});await models.check();
  s.plan=await models.askValidated('planner','scene-plan','Summarize the player intention and one consequence using only these implemented domains. Do not invent features or claim proof of concept contribution. '+JSON.stringify({specificIntent:profile.scene.behavior.specificIntent,preparedInterpretation:profile.scene.behavior.preparedInterpretation,domains:profile.presentation.instances.map(n=>n.label),choice:0}),interpretationSchema(1),500);
  s.status='WRITING';s.editorial=await models.askValidated('writer','scene-write','Choose a short title describing the spatial action, a supported palette, and an accurate one-sentence description. Avoid player occupations and the words 3D, pilot, prototype, demo in the title. '+JSON.stringify({goal:s.composition.goal,intent:s.plan.intent}),editorialSchema,350);
  const final=compilePlayableScene(spec.catalog,profile,{title:s.editorial.title,theme:s.editorial.palette});s.composition=final.composition;s.status='ASSEMBLING';await save();Object.assign(s,await build(s.composition,id));if(s.sourceHash!==s.admissionSourceHash)throw Error('Source changed after admission');s.status='TESTING';await save();s.browser=await reviewScene(experiments,id,final.validationPlan,{signal:combined});
  const image=s.browser.image,before=s.browser.initialImage;delete s.browser.image;delete s.browser.initialImage;if(image)await writeFile(path.join(experiments,id,'review.png'),image,{flag:'wx'});if(before)await writeFile(path.join(experiments,id,'initial.png'),before,{flag:'wx'});guard.check();if(s.browser.status!=='PASS')throw Error(s.browser.errors.join('; '));
  s.status='VISUAL_REVIEW';await save();s.visualFrames=[];for(const [frameId,bytes]of [['initial',before],['consequence',image]]){const result=await models.askValidated('writer','scene-review','Inspect this single actual gameplay image for visible geometry, readable labels, player visibility and obstruction. Judge only what is visible; do not claim controls work, routes are reachable or the game is unique. '+JSON.stringify({frameId,goal:s.composition.goal,view:s.composition.presentation.camera}),reviewSchema,500,bytes);s.visualFrames.push({frameId,imageHash:digest(bytes),result});await save();if(result.verdict!=='PASS')throw Error('Visual review '+frameId+': '+result.observation);}
  guard.check();if(s.sourceHash!==await fingerprint())throw Error('Source changed during scene generation');s.signature=digest({runtime:s.composition.runtime,camera:s.composition.presentation.camera});s.previewVerdict='PASS';s.status='NEEDS_REVIEW';s.acceptance={verdict:'NEEDS_REVIEW',missing:['catalog eligibility','independent concept causality','comparative novelty','replay tradeoff','presentation and audio','target-device performance','human comprehension']};s.elapsedMs=Date.now()-started;s.completed=Date.now();await save();await indexPreview(id);return s;
 }catch(e){if(!s)throw e;s.status=signal?.aborted?'CANCELLED':'FAIL';s.error=e.message;s.elapsedMs=Date.now()-s.started;await atomicJSON(path.join(experiments,id,'spine.json'),s);onProgress({id,status:s.status,error:s.error});return s;}finally{await release();}
}
