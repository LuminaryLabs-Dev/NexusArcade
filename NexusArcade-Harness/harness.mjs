import {mkdir,readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {root,experiments,fingerprint,build} from './assembly.mjs';
import {rollConcepts,expand,signature,validateComposition,interpretationSchema,editorialSchema,instructions} from './composition.mjs';
import {Models} from './model.mjs';
import {reviewSchema} from './domains.mjs';
import {review3d} from './review3d.mjs';
import {atomicJSON,deadline,writerLease,contracts,digest} from './factory.mjs';
import {improve} from './improvement.mjs';
export {root,experiments,fingerprint};
export const json=atomicJSON;
export function safeId(id){if(!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,70}$/.test(id))throw Error('Invalid experiment id');return id;}
export async function summaries(){await mkdir(experiments,{recursive:true});const rows=[];for(const f of await readdir(experiments)){try{const s=JSON.parse(await readFile(path.join(experiments,f,'spine.json')));rows.push({id:s.id,version:s.version,started:s.started,status:s.status,title:s.composition?.title??s.recipe?.title??s.id,seed:s.seed,depth:s.depth,elapsedMs:s.elapsedMs,outputTokens:s.outputTokens,error:s.error,signature:s.signature,concepts:s.composition?.concepts??[],layout:s.composition?.layout,actions:s.composition?.nodes.map(n=>n.action),hasArtifact:!!s.artifactHash,previewVerdict:s.previewVerdict,acceptance:s.acceptance?.verdict,instructions:s.composition?.instructions});}catch{}}return rows.sort((a,b)=>a.started-b.started);}
export async function generate({id,seed,depth=2,signal,onProgress=()=>{}}){safeId(id);const roll=rollConcepts(seed,depth);await mkdir(experiments,{recursive:true});const admittedAt=Date.now(),release=await writerLease(id);let s;const dir=path.join(experiments,id);try{await mkdir(dir);const started=admittedAt,spec=await contracts();s={version:3,id,seed,depth,roll,started,deadline:started+1500000,purpose:'development',ruleVersion:spec.hash,status:'EXPANDING',calls:[],attempts:[]};const guard=deadline(s,signal);const save=async()=>{guard.check();await json(path.join(dir,'spine.json'),s);onProgress({id,status:s.status,calls:s.calls.length,elapsedMs:Date.now()-s.started});};const combined=AbortSignal.any([AbortSignal.timeout(guard.remaining()),...(signal?[signal]:[])]);const used=new Set((await summaries()).filter(r=>r.status==='PASS').map(r=>r.signature));const shortlist=expand(roll,used);s.expansion={candidates:shortlist.length,limit:160};await save();const models=new Models(s,save,{signal:combined});await models.check();
 const brief=shortlist.map((c,i)=>({choice:i,layout:c.layout,objective:c.goal,required:c.required,exit:c.exit,anchors:c.nodes.map(n=>({concept:n.concept,meaning:n.intent,action:n.action,requires:n.requires,receiver:n.receiver}))}));s.status='INTERPRETING';s.plan=await models.ask('planner','compose','Choose the most coherent spatial interpretation. Explain the player intention using ONLY these supported relationships. Follow the supplied objective and exit. No combat, mazes or invented behavior. '+JSON.stringify({concepts:roll.concepts,candidates:brief}),interpretationSchema(shortlist.length),500);
 s.composition=shortlist[s.plan.choice];s.status='WRITING';const prompt='Give a concise evocative title, palette and short tagline to this floating-platform 3D composition. Do not promise new mechanics. '+JSON.stringify({intent:s.plan.intent,nodes:s.composition.nodes.map(n=>({concept:n.concept,action:n.action,requires:n.requires}))});
 s.editorial=await models.askValidated('writer','compose-write',prompt,editorialSchema,350);
 Object.assign(s.composition,{title:s.editorial.title,palette:s.editorial.palette,instructions:instructions(s.composition)});validateComposition(s.composition);s.signature=signature(s.composition);
 const checkIds=['browser-loop','visual-readability','factory-evidence'];
 const features=[{id:'gameplay',dependsOn:[],state:'unverified',evidenceRefs:[]},{id:'presentation',dependsOn:['gameplay'],state:'unverified',evidenceRefs:[]}];
 const repairContract={schema:spec.policy.llmContract.outputSchema,checkIds,editablePaths:{'/palette':editorialSchema.properties.palette},featuresByPath:{'/palette':['presentation']},checksByFeature:{gameplay:['browser-loop'],presentation:['visual-readability']}};
 const result=await improve({profile:s.composition,features,guard,repairContract,
  save:async state=>{s.controller=state;s.status=state.status;await save();},
  build:async candidate=>{guard.check();validateComposition(candidate.profile);const candidateId=candidate.revision==='0'?id:id.slice(0,50)+'-r'+candidate.revision+'-'+digest(id).slice(0,6);if(candidateId!==id)await mkdir(path.join(experiments,candidateId));return {...await build(candidate.profile,candidateId),candidateId};},
  review:async candidate=>{
   s.status='TESTING';await save();const browser=await review3d(experiments,candidate.artifact.candidateId,{signal:combined});guard.check();const image=browser.image,overview=browser.overviewImage;delete browser.image;delete browser.overviewImage;
   const location=path.join(experiments,candidate.artifact.candidateId);if(image)await writeFile(path.join(location,'review.png'),image,{flag:'wx'});if(overview)await writeFile(path.join(location,'overview.png'),overview,{flag:'wx'});
   let visual={verdict:'NEEDS_REVIEW',observation:'Browser loop must pass before visual review.'};
   if(browser.status==='PASS'){s.status='VISUAL_REVIEW';await save();visual=await models.ask('writer','visual-review','Inspect the actual game frames. PASS only if the actor, usable routes, interaction objects and objective markers are visible and readable. FAIL for missing geometry, unreadable contrast or occlusion. This checks readability only; it does not establish novelty or gameplay.',reviewSchema,300,overview?[image,overview]:image);}
   if(candidate.artifact.sourceHash!==await fingerprint())throw Error('Harness changed during run');
   const checks=[{id:'browser-loop',verdict:browser.status,evidenceHash:digest(browser)},{id:'visual-readability',verdict:visual.verdict,evidenceHash:digest(visual)},{id:'factory-evidence',verdict:'NEEDS_REVIEW',evidenceHash:digest({missing:['concept ablation','independent visual/interaction novelty','target-device performance','player comprehension']})}];
   const findings=checks.filter(c=>c.verdict!=='PASS').map(c=>({id:c.id+'-missing',checkId:c.id,severity:c.id==='browser-loop'?'behavior':'review',observation:c.id==='browser-loop'?browser.errors.join('; '):c.id==='visual-readability'?visual.observation:'Mandatory factory evidence is not implemented or calibrated. Shared work is required.'}));
   return {profileHash:candidate.profileHash,checks,findings,browser,visual};
  },
  propose:async context=>{
   const f=context.findings.find(x=>x.checkId==='browser-loop')??context.findings.find(x=>x.checkId==='visual-readability')??context.findings[0];
   if(f.checkId!=='visual-readability')return {candidateRevision:context.revision,findingId:f.id,decision:'needs_evidence',changes:[],expectedCheckIds:[f.checkId],reason:'Shared validation or engine work is required; a palette edit cannot resolve it.'};
   return models.ask('planner','repair','Resolve only this readability finding using an allowed palette replacement, or report no_supported_solution. Preserve all gameplay and requirements. '+JSON.stringify({...context,finding:f,allowedPalettes:editorialSchema.properties.palette.enum}),repairContract.schema,700);
  }
 });
 const best=result.best;if(!best)throw Error(result.reason??'No reviewable candidate');
 const artifact=result.history.find(x=>x.revision===best.revision)?.artifact;Object.assign(s,artifact);s.composition=best.profile;s.browser=best.result.browser;s.visual=best.result.visual;
 s.previewVerdict=s.browser.status==='PASS'&&s.visual.verdict==='PASS'?'PASS':'FAIL';s.acceptance={verdict:'NEEDS_REVIEW',ruleVersion:s.ruleVersion,missing:best.result.findings};s.status=s.previewVerdict==='PASS'?'NEEDS_REVIEW':'FAIL';if(s.status==='FAIL')s.error=result.reason??best.result.findings.map(f=>f.observation).join('; ');
 guard.check();s.completed=Date.now();s.elapsedMs=s.completed-s.started;s.outputTokens=s.calls.reduce((n,c)=>n+(c.outputTokens??c.reserved),0);await save();return s;
 }catch(e){if(!s)throw e;s.status=signal?.aborted?'CANCELLED':'FAIL';s.error=e.message;s.elapsedMs=Date.now()-s.started;s.outputTokens=s.calls.reduce((n,c)=>n+(c.outputTokens??c.reserved),0);await json(path.join(dir,'spine.json'),s);onProgress({id,status:s.status,error:s.error});return s;}finally{await release();}}
