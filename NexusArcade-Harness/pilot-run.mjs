import {mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import {pilotProfile,validatePilot} from './pilot-spec.mjs';
import {Models} from './model.mjs';
import {editorialSchema,interpretationSchema} from './composition.mjs';
import {reviewSchema} from './domains.mjs';
import {atomicJSON,writerLease,deadline,contracts,digest} from './factory.mjs';
import {experiments,build,fingerprint} from './assembly.mjs';
import {reviewPilot} from './pilot-review.mjs';
import {indexPreview} from './library.mjs';
import {resolveScaffold,scaffoldBuildSelection,inspectScaffold} from './scaffold.mjs';

const validId=x=>typeof x==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,70}$/.test(x);

async function finishProfile({id,kind,profile,s,guard,save,models,combined,scaffoldSelection}){
 if(scaffoldSelection){
  s.plan={intent:s.scaffold.integration.interpretation,interpretation:s.scaffold.integration.interpretation,playerGoal:s.scaffold.integration.playerGoal,loop:s.scaffold.integration.loop,domainContributions:s.scaffold.integration.domainContributions,connectionUses:s.scaffold.integration.connectionUses};
 }
 const writerSchema=structuredClone(editorialSchema);if(scaffoldSelection)writerSchema.properties.palette.enum=[profile.palette];
 s.status='WRITING';
 const writerInput=scaffoldSelection?{genre:scaffoldSelection.rootOptions.genre.id,form:scaffoldSelection.rootOptions.gameForm.id,goal:profile.goal,interpretation:s.scaffold.integration.interpretation,palette:profile.palette}: {kind,goal:profile.goal,intent:s.plan.intent};
 s.editorial=await models.askValidated('writer','pilot-write',scaffoldSelection?'Give this game a short title describing its implemented spatial action or consequence. Return the supplied palette exactly. Do not add an occupation, feature or objective absent from the composition. Avoid the words 3D, pilot, prototype, and demo in its title. '+JSON.stringify(writerInput):'Give this game a short title describing its spatial action or consequence, and an accurate description. Avoid player job titles. Avoid the words 3D, pilot, prototype, and demo in its title. '+JSON.stringify(writerInput),writerSchema,350);
 profile.title=s.editorial.title;if(!scaffoldSelection)profile.palette=s.editorial.palette;
 if(scaffoldSelection){profile.scaffoldIntegration={interpretation:s.scaffold.integration.interpretation,loop:s.scaffold.integration.loop};profile.scaffoldSelections={...scaffoldSelection.rootSelections,profileSeed:scaffoldSelection.profileSeed,presentationId:scaffoldSelection.presentationId};}
 validatePilot(profile);s.composition=profile;s.status='ASSEMBLING';await save();Object.assign(s,await build(profile,id));s.status='TESTING';await save();
 s.browser=await reviewPilot(experiments,id,{signal:combined});const image=s.browser.image,detail=s.browser.detailImage,before=s.browser.initialImage;delete s.browser.image;delete s.browser.detailImage;delete s.browser.initialImage;if(before)await writeFile(path.join(experiments,id,'initial.png'),before,{flag:'wx'});if(detail)await writeFile(path.join(experiments,id,'detail.png'),detail,{flag:'wx'});if(image)await writeFile(path.join(experiments,id,'review.png'),image,{flag:'wx'});guard.check();if(s.browser.status!=='PASS')throw Error(s.browser.errors.join('; '));
 s.status='VISUAL_REVIEW';await save();s.visualFrames=[];for(const [frameId,bytes] of [...(before?[['initial',before]]:[]),['consequence',image],...(detail?[['detail',detail]]:[])]){const result=await models.askValidated('writer','pilot-review','Inspect only this actual gameplay image. Judge visible geometry, silhouette readability, and camera framing. For first-action, consequence, and ending frames, also judge whether controls and goal-related objects are legible. For a detail crop, judge only the geometry and readability actually inside the crop; do not require HUD, controls, or goals that are outside it. Ignore all objective text, gameplay instructions, route strategy, scores, novelty, audio, interaction success, and inferred state. '+JSON.stringify({kind,frameId}),reviewSchema,500,bytes);s.visualFrames.push({frameId,imageHash:digest(bytes),result});await save();}
 const modelDisagreements=s.visualFrames.filter(f=>f.result.verdict!=='PASS').map(f=>({frameId:f.frameId,observation:f.result.observation}));s.visual={verdict:modelDisagreements.length?'NEEDS_REVIEW':'PASS',observation:s.visualFrames.map(f=>f.frameId+': '+f.result.observation).join('; '),modelDisagreements};guard.check();if(s.sourceHash!==await fingerprint())throw Error('Source changed during pilot');
 s.signature=digest({kind,nodes:profile.nodes,world:profile.world,view:profile.view,domainGraph:profile.domainGraph,spatialWorld:profile.spatialWorld,track:profile.track,handling:profile.handling});const replayCheck=s.browser.checks?.find(c=>/replay|route choice trades|shortcut improves lap|delivery order and shortcuts/.test(String(c.name??''))&&(c.pass===true||c.passed===true));const missing=['replay tradeoff','independent concept contribution','comparative novelty rubric','presentation and audio','target-device performance','human comprehension'];if(replayCheck)missing.splice(0,1);if(s.visual.modelDisagreements?.length)missing.push('visual model disagreement');s.replay={qualifies:!!replayCheck,evidence:replayCheck??null};s.previewVerdict='PASS';s.acceptance={verdict:'NEEDS_REVIEW',ruleVersion:s.ruleVersion,missing};s.status='NEEDS_REVIEW';s.elapsedMs=Date.now()-s.started;s.completed=Date.now();await save();await indexPreview(id);return s;
}

export async function generatePilot({id,kind,seed,retryOf,scaffold=null,startedAt=Date.now(),signal,onProgress=()=>{}}){
 if(!validId(id))throw Error('Invalid pilot ID');if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Invalid pilot seed');if(scaffold){inspectScaffold(scaffold);if(scaffold.seed!==seed)throw Error('Scaffold seed differs from request');if(retryOf)throw Error('Scaffold retries require a new scaffold-aware repair rule');}
 if(!Number.isFinite(startedAt)||startedAt>Date.now()+1000)throw Error('Invalid request start time');
 const admittedAt=Date.now(),release=await writerLease(id);let s,profile;
 try{
  await mkdir(path.join(experiments,id));let prior;
  if(retryOf){if(!validId(retryOf))throw Error('Invalid prior attempt');prior=JSON.parse(await readFile(path.join(experiments,retryOf,'spine.json')));if(prior.seed!==seed||prior.composition.kind!==kind||!['FAIL','NEEDS_REVIEW'].includes(prior.status))throw Error('Incompatible retry');}
  const spec=await contracts(),selection=scaffold?scaffoldBuildSelection(scaffold):null,effectiveKind=scaffold?(scaffold.nodes.find(n=>n.category==='gameForm')?.runtimeFamily??null):kind,profileSeed=selection?.supported?selection.profileSeed:seed;
  if(!scaffold||selection?.supported)profile=pilotProfile(effectiveKind,profileSeed,scaffold?{conceptIds:selection.conceptIds,scaffoldSelections:selection}:{});
  const started=prior?.started??(scaffold?startedAt:admittedAt);if(prior&&(prior.ruleVersion!==spec.hash||prior.deadline!==prior.started+1500000))throw Error('Retry changed frozen rules or original deadline');
  s={version:3,purpose:scaffold?'random-game-scaffold-preview':'foundation-pilot',id,ideaId:prior?.ideaId??retryOf??id,retryOf:retryOf??null,revisionCreated:Date.now(),started,deadline:started+1500000,seed,profileSeed:scaffold?profileSeed:seed,kind:effectiveKind,composition:profile??null,calls:[],status:'PLANNING',ruleVersion:spec.hash,...(scaffold?{scaffold:structuredClone(scaffold),scaffoldBuildSelection:selection}:{})};
  const guard=deadline(s,signal),combined=AbortSignal.any([AbortSignal.timeout(guard.remaining()),...(signal?[signal]:[])]),save=async()=>{guard.check();await atomicJSON(path.join(experiments,id,'spine.json'),s);onProgress({id,status:s.status,elapsedMs:Date.now()-started});};await save();const models=new Models(s,save,{signal:combined});await models.check();
  if(scaffold){
   s.status='TRAVERSING';await save();await resolveScaffold(s.scaffold,models,save);const resolved=scaffoldBuildSelection(s.scaffold);s.scaffoldBuildSelection=resolved;
   if(s.scaffold.gaps.some(g=>['OPEN','UNRESOLVED'].includes(g.status)))throw Error('SCAFFOLD_GAPS_UNRESOLVED');
   if(!resolved.supported)throw Error('ENGINE_CAPABILITY_REQUIRED: '+resolved.reason);
   if(resolved.family!==effectiveKind)throw Error('Locked game form changed during integration');
   profile=pilotProfile(resolved.family,resolved.profileSeed,{conceptIds:resolved.conceptIds,scaffoldSelections:resolved});s.composition=profile;s.profileSeed=resolved.profileSeed;s.status='PLANNING';s.plan={intent:s.scaffold.integration.interpretation};await save();
  }else{
   const conceptIntents=profile.conceptRoll.concepts.flatMap(c=>c.branches.map(b=>b.intent)),requiredIntent=conceptIntents[seed%conceptIntents.length];
   s.plan=await models.askValidated('planner','pilot-plan','Explain how the implemented pilot can test the required concept intent. Return the required intent verbatim in the intent field; do not substitute another branch. Treat the concepts as hypotheses until runtime evidence proves them; do not invent features or claim unsupported behavior. '+JSON.stringify({profile:{kind:profile.kind,goal:profile.goal,concepts:profile.conceptRoll,selection:profile.selection,replay:profile.replay.reason},allowedIntents:conceptIntents,requiredIntent}),interpretationSchema(1),500);
   if(s.plan.intent!==requiredIntent)throw Error('Planner intent does not match the seed-selected concept branch intent');
  }
  return await finishProfile({id,kind:effectiveKind,profile,s,guard,save,models,combined,scaffoldSelection:scaffold?s.scaffoldBuildSelection:null});
 }catch(e){if(!s)throw e;s.status=signal?.aborted?'CANCELLED':'FAIL';s.error=e.message;s.elapsedMs=Date.now()-s.started;await atomicJSON(path.join(experiments,id,'spine.json'),s);onProgress({id,status:s.status,error:s.error});return s;}finally{await release();}
}
