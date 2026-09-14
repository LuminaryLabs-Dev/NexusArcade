import {generate,summaries,experiments,safeId,json,fingerprint} from './harness.mjs';
import {rollConcepts,expand,signature,validateComposition} from './composition.mjs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {hash} from './model.mjs';
import assert from 'node:assert/strict';
import {generatePilot} from './pilot-run.mjs';
import {generateScene} from './scene-run.mjs';
import {compileConceptRecipe} from './concept-recipe.mjs';
import {compileSceneRecipe} from './scene-recipe.mjs';
import {rollSceneLayers} from './scene-layers.mjs';
import {compilePlayableScene} from './scene-spec.mjs';
import {contracts,queueSnapshot,recoverWriter} from './factory.mjs';
import {writeCandidateIndex} from './candidate-index.mjs';
import {recordCandidateReview} from './candidate-review.mjs';
import {planCatalogAddition,updateCatalog,resumeCatalogUpdate} from './catalog-update.mjs';
import {inspectCatalog,rollConceptRoots} from './catalog.mjs';
import {cleanupFailed} from './cleanup.mjs';
import {compileCatalogBehavior,compileCatalogScene} from './catalog-compiler.mjs';
const [command='list',...args]=process.argv.slice(2);const get=(key,fallback)=>{const i=args.indexOf('--'+key);return i<0?fallback:args[i+1];};
const controller=new AbortController();process.on('SIGINT',()=>controller.abort());process.on('SIGTERM',()=>controller.abort());
if(command==='compile-concepts'||command==='scene-concepts'){
 const file=get('recipe',null);if(!file)throw Error('Expected --recipe with a concept-fragment recipe');const conceptRecipe=JSON.parse(await readFile(file,'utf8'));if(get('seed',undefined)!==undefined)conceptRecipe.seed=Number(get('seed'));
 if(command==='compile-concepts'){const {catalog}=await contracts();console.log(JSON.stringify(compileConceptRecipe(catalog,conceptRecipe),null,2));}
 else{const s=await generateScene({id:safeId(get('id','concept-'+Date.now())),conceptRecipe,retryOf:get('retry-of',undefined),repairReason:get('repair-reason',undefined),signal:controller.signal,onProgress:p=>console.log(JSON.stringify(p))});console.log(JSON.stringify({id:s.id,status:s.status,preview:s.previewVerdict,error:s.error}));if(s.status==='FAIL'){process.exitCode=1;console.log(JSON.stringify({cleanup:await cleanupFailed(s.id,{apply:true})}));}}
}else if(command==='roll-concepts'){
 const file=get('list',null);if(!file)throw Error('Expected --list with optionIds, count and depth');const input=JSON.parse(await readFile(file,'utf8'));if(!input||Object.keys(input).some(k=>!['optionIds','count','depth'].includes(k)))throw Error('Invalid concept list');const {catalog}=await contracts();console.log(JSON.stringify(rollConceptRoots(catalog,{...input,seed:Number(get('seed',0))}),null,2));
}else if(command==='catalog-update'){
 if(args.includes('--resume'))console.log(JSON.stringify(await resumeCatalogUpdate(),null,2));
 else{const file=get('catalog',null);if(!file)throw Error('Expected --catalog with the full proposed catalog');const next=JSON.parse(await readFile(file,'utf8'));if(args.includes('--apply'))console.log(JSON.stringify(await updateCatalog(next,{expectedHash:get('expected-hash',null)}),null,2));else{const plan=planCatalogAddition(await contracts(),next);console.log(JSON.stringify({from:plan.from,to:plan.to,additions:plan.additions,scope:plan.scope},null,2));}}
}else if(command==='factory-check'){const {queue,catalog,policy,profile,hash}=await contracts();const audit=inspectCatalog(catalog,{validationRules:policy.validationRules});console.log(JSON.stringify({contractHash:hash,version:policy.schemaVersion,goals:queue.goals.length,target:queue.goals.reduce((n,g)=>n+g.acceptedGameTarget,0),requiredRules:profile.acceptance.requiredRuleIds,unresolvedCalibrations:policy.calibrationDecisions.filter(c=>c.status==='UNRESOLVED').map(c=>c.id),catalog:audit},null,2));
}else if(command==='compile-behavior'||command==='compile-scene'){
 const file=get('profile',null);if(!file)throw Error('Expected --profile with a behavior-composition JSON file');
 const {catalog}=await contracts();console.log(JSON.stringify((command==='compile-scene'?compileCatalogScene:compileCatalogBehavior)(catalog,JSON.parse(await readFile(file,'utf8'))),null,2));
}else if(command==='compile-recipe'||command==='scene-recipe'){
 const file=get('recipe',null);if(!file)throw Error('Expected --recipe with a scene recipe');const recipe=JSON.parse(await readFile(file,'utf8'));
 if(command==='compile-recipe'){const {catalog}=await contracts();console.log(JSON.stringify(compileSceneRecipe(catalog,recipe),null,2));}
 else{const s=await generateScene({id:safeId(get('id','scene-'+Date.now())),recipe,retryOf:get('retry-of',undefined),repairReason:get('repair-reason',undefined),signal:controller.signal,onProgress:p=>console.log(JSON.stringify(p))});console.log(JSON.stringify({id:s.id,status:s.status,preview:s.previewVerdict,error:s.error}));if(s.status==='FAIL'){process.exitCode=1;console.log(JSON.stringify({cleanup:await cleanupFailed(s.id,{apply:true})}));}}
}else if(command==='roll-scene-layers'){
 const file=get('lists',null);if(!file)throw Error('Expected --lists with supported scene-layer choices');const {catalog}=await contracts();console.log(JSON.stringify(rollSceneLayers(catalog,Number(get('seed',0)),JSON.parse(await readFile(file,'utf8'))),null,2));
}else if(command==='assemble-scene'||command==='scene'){
 const file=get('profile',null);if(!file)throw Error('Expected --profile with a playable scene profile');const profile=JSON.parse(await readFile(file,'utf8'));
 if(command==='assemble-scene'){const {catalog}=await contracts();console.log(JSON.stringify(compilePlayableScene(catalog,profile),null,2));}
 else{const s=await generateScene({id:safeId(get('id','scene-'+Date.now())),profile,retryOf:get('retry-of',undefined),repairReason:get('repair-reason',undefined),signal:controller.signal,onProgress:p=>console.log(JSON.stringify(p))});console.log(JSON.stringify({id:s.id,status:s.status,preview:s.previewVerdict,error:s.error}));if(s.status==='FAIL'){process.exitCode=1;console.log(JSON.stringify({cleanup:await cleanupFailed(s.id,{apply:true})}));}}
}else if(command==='cleanup-failed'){console.log(JSON.stringify(await cleanupFailed(safeId(get('id','')),{apply:args.includes('--apply')}),null,2));
}else if(command==='queue'){console.log(JSON.stringify(await queueSnapshot(),null,2));
}else if(command==='g03-causality'){const {measureG03ConceptSensitivity}=await import('./g03-causality.mjs');console.log(JSON.stringify(await measureG03ConceptSensitivity(),null,2));
}else if(command==='g03-comparison'){const {measureG03Comparison}=await import('./g03-comparison.mjs');console.log(JSON.stringify(await measureG03Comparison(),null,2));
}else if(command==='g03-review-template'){const {writeG03ReviewTemplate}=await import('./g03-review-template.mjs');console.log(JSON.stringify(await writeG03ReviewTemplate(),null,2));
}else if(command==='g03-performance'){const {measureG03Performance}=await import('./g03-performance.mjs');console.log(JSON.stringify(await measureG03Performance(),null,2));
}else if(command==='g03-presentation'){const {measureG03Presentation}=await import('./g03-presentation.mjs');console.log(JSON.stringify(await measureG03Presentation(),null,2));
}else if(command==='g03-target-performance'){const {measureG03TargetPerformance}=await import('./g03-target-performance.mjs');console.log(JSON.stringify(await measureG03TargetPerformance(),null,2));
}else if(command==='g03-feedback'){const {measureG03Feedback}=await import('./g03-feedback.mjs');console.log(JSON.stringify(await measureG03Feedback(),null,2));
}else if(command==='g03-reduced-effects'){const {measureG03ReducedEffects}=await import('./g03-reduced-effects.mjs');console.log(JSON.stringify(await measureG03ReducedEffects(),null,2));
}else if(command==='g03-evidence'){const {writeG03Evidence}=await import('./g03-evidence.mjs');console.log(JSON.stringify(await writeG03Evidence(),null,2));
}else if(command==='candidate-review'){const file=get('file',null);if(!file)throw Error('Expected --file with explicit reviewer verdicts');console.log(JSON.stringify(await recordCandidateReview(JSON.parse(await readFile(file,'utf8'))),null,2));
}else if(command==='candidate-index'){const ids=(get('ids','').split(',').map(x=>x.trim()).filter(Boolean));console.log(JSON.stringify(await writeCandidateIndex(ids),null,2));
}else if(command==='recover'){console.log(JSON.stringify(await recoverWriter()));
}else if(command==='pilot'){const s=await generatePilot({id:safeId(get('id','pilot-'+Date.now())),kind:get('kind','rally'),retryOf:get('retry-of',undefined),seed:Number(get('seed',97000)),signal:controller.signal,onProgress:p=>console.log(JSON.stringify(p))});console.log(JSON.stringify({id:s.id,status:s.status,error:s.error,preview:s.previewVerdict,elapsedMs:s.elapsedMs}));if(s.status==='FAIL'){process.exitCode=1;try{console.log(JSON.stringify({cleanup:await cleanupFailed(s.id,{apply:true})}));}catch(e){console.log(JSON.stringify({cleanup:'RETAINED',reason:e.message}));}}
}else if(command==='generate'||command==='batch'){
 if(command==='batch')throw Error('Factory batch admission is gated by G01–G03. Use pilot or generate for a development probe.');
 const count=Number(get('count',command==='batch'?50:1)),base=Number(get('seed',93000)),prefix=safeId(get('prefix','run-'+Date.now()));if(!Number.isInteger(count)||count<1||count>50)throw Error('Count must be 1–50');let repeated=0,lastFailure='';
 for(let i=0;i<count&&!controller.signal.aborted;i++){const id=prefix+'-'+String(i+1).padStart(3,'0');const s=await generate({id,seed:base+i,depth:Number(get('depth',1+i%3)),signal:controller.signal,onProgress:p=>console.log(JSON.stringify(p))});console.log(JSON.stringify({completed:id,status:s.status,seconds:Math.round(s.elapsedMs/1000),tokens:s.outputTokens,error:s.error}));const rows=(await summaries()).filter(r=>r.id.startsWith(prefix+'-'));await json(path.join(experiments,prefix+'-summary.json'),{count:rows.length,passed:rows.filter(r=>r.status==='PASS').length,rows});if(s.status!=='PASS')process.exitCode=1;const failure=s.error??'';repeated=failure&&failure===lastFailure?repeated+1:failure?1:0;lastFailure=failure;if(repeated>=3){console.log('STOP: repeated issue requires a shared harness correction: '+failure);break;}}
}else if(command==='check'){
 const used=new Set();for(let seed=0;seed<1000;seed++){const r=rollConcepts(seed,1+seed%3);assert.deepEqual(r,rollConcepts(seed,1+seed%3));assert.equal(new Set(r.concepts.map(c=>c.id)).size,3);const c=expand(r,used)[0];validateComposition(c);used.add(signature(c));}assert.equal(used.size,1000);for(const x of ['../x','', 'x/y'])assert.throws(()=>safeId(x));console.log('PASS 1000 reproducible, distinct supported composition graphs; safe IDs');
}else if(command==='verify'){
 const cache=new Map(),seen=new Set();let total=0;for(const row of (await summaries()).filter(r=>r.version===2&&r.id.startsWith(get('prefix',''))&&r.status==='PASS')){const dir=path.join(experiments,row.id),s=JSON.parse(await readFile(path.join(dir,'spine.json')));validateComposition(s.composition);assert.equal(hash(await readFile(path.join(dir,'index.html'))),s.artifactHash);assert.equal(hash(await readFile(path.join(dir,'review.png'))),s.browser.screenshotHash);if(s.browser.overviewHash)assert.equal(hash(await readFile(path.join(dir,'overview.png'))),s.browser.overviewHash);assert.deepEqual(JSON.parse(await readFile(path.join(dir,'composition.json'))),s.composition);assert.equal(signature(s.composition),s.signature);assert(!seen.has(s.signature),'Duplicate structural composition');seen.add(s.signature);assert.equal(s.visual.verdict,'PASS');assert.equal(s.browser.status,'PASS');if(!cache.has(s.sourceHash)){const runtime=path.join(experiments,'.runtime',s.sourceHash),manifest=JSON.parse(await readFile(path.join(runtime,'manifest.json')));for(const [file,digest] of Object.entries(manifest))assert.equal(hash(await readFile(path.join(runtime,file))),digest,file);cache.set(s.sourceHash,true);}total++;}console.log('PASS: '+total+' distinct games, artifacts, compositions, screenshots and shared runtime hashes verified');
}else console.log(JSON.stringify(await summaries(),null,2));
