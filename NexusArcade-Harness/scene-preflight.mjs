import {createSceneEngine} from './kits/scene-runtime.mjs';
import {routeInWorld,worldSupports} from './kits/spatial-world.mjs';
import {validateScenePlan} from './scene-spec.mjs';
import {digest} from './factory.mjs';
import {domainDefinitions} from './kits/domain-graph.mjs';

// Execute ordinary movement/action inputs before spending local inference time.
// This is a runtime feasibility check, never browser, novelty or player evidence.
export async function preflightScene(runtime,plan,{signal,deadlineAt=Date.now()+60000,witnesses=[]}={}){
 if(!Number.isFinite(deadlineAt))throw Error('Invalid preflight deadline');
 validateScenePlan(plan,runtime);
 if(runtime.movement.adapter!=='walk')throw Error('Scene preflight requires a supported movement driver');
 let api=createSceneEngine(runtime).n.arcade,observe=false;
 const world=runtime.collision.world,initial=api.snapshot().domainState,seen=new Set();
 if(!Array.isArray(witnesses)||witnesses.length>64)throw Error('Invalid concept witnesses');
 const observations=witnesses.map(w=>{
  const n=runtime.domainGraph.instances.find(n=>n.id===w?.instanceId),key=digest(w);
  if(!n||['controls','objective'].includes(n.capability)||!Object.hasOwn(domainDefinitions[n.capability].outputs,w.port)||!['change','increase'].includes(w.expectation)||w.verdict!=='REQUIRED'||typeof w.conceptOptionId!=='string'||typeof w.branchId!=='string'||seen.has(key))throw Error('Invalid concept witness');
  seen.add(key);const before=initial[w.instanceId][w.port];if(w.expectation==='increase'&&typeof before!=='number')throw Error('Increase witness requires numeric state');
  return {...w,before:structuredClone(before),changed:false};
 });
 const report={status:'FAIL',method:'NexusEngine input simulation; no rendering or model review',runtimeHash:digest(runtime),planHash:digest(plan),checks:[],steps:0};
 const check=(name,pass)=>{report.checks.push({name,pass});if(!pass)throw Error(name);};
 const tick=async(seconds,input={})=>{for(let left=seconds;left>1e-9;left-=.05){if(report.steps%128===0)await new Promise(resolve=>setImmediate(resolve));signal?.throwIfAborted();if(Date.now()>=deadlineAt)throw Error('Preflight deadline exceeded');if(++report.steps>200000)throw Error('Preflight step bound exceeded');api.step(Math.min(.05,left),input);if(observe&&observations.length){const s=api.snapshot();for(const w of observations){const value=s.domainState[w.instanceId][w.port];if(!w.changed&&(w.expectation==='increase'?value>w.before:digest(value)!==digest(w.before))){w.changed=true;w.after=structuredClone(value);w.at=s.elapsed;}}}}};
 const walk=async(x,z)=>{
  const start=api.snapshot(),route=routeInWorld(world,start.player,{x,z},start.domainState);
  for(const p of route.points.slice(1)){
   let reached=false;
   for(let i=0;i<700;i++){
    const s=api.snapshot(),dx=p.x-s.player.x,dz=p.z-s.player.z;
    if(Math.hypot(dx,dz)<.18){reached=true;break;}
    if(s.mode==='won')return;
    if(s.mode!=='play')throw Error('Session ended before planned movement');
    await tick(.05,{x:Math.abs(dx)>.1?Math.sign(dx):0,z:Math.abs(dz)>.1?Math.sign(dz):0});
    const next=api.snapshot();if(!worldSupports(world,next.player,next.domainState))throw Error('Actor left supported world');
   }
   if(!reached)throw Error('Planned waypoint unreachable through movement');
  }
 };
 const run=async(omit=false,steps=plan.steps)=>{for(const step of steps){if(api.snapshot().mode!=='play')break;
  if(step.action==='move')await walk(step.x,step.z);
  else if(step.action==='interact'&&!omit)for(let i=0;i<step.count;i++){await tick(.05,{interact:true});await tick(.05);}
  else if(step.action==='wait')await tick(step.seconds);
 }return api.snapshot();};
 try{
  observe=true;api.start();const won=await run();check('planned inputs complete the loop',won.mode==='won');report.winSeconds=won.elapsed;
  api.reset();api.start();check('restart clears session',api.snapshot().elapsed===0);const again=await run();check('repeated loop completes',again.mode==='won');check('same inputs reproduce time',Math.abs(again.elapsed-won.elapsed)<1e-8);
  report.routes=[{id:'primary',seconds:won.elapsed,plannedInteractions:plan.steps.filter(s=>s.action==='interact').reduce((n,s)=>n+s.count,0)}];
  for(const route of plan.alternatives??[]){
   observe=true;api.reset();api.start();const result=await run(false,route.steps);check('alternative completes '+route.id,result.mode==='won');report.routes.push({id:route.id,seconds:result.elapsed,plannedInteractions:route.steps.filter(s=>s.action==='interact').reduce((n,s)=>n+s.count,0)});observe=false;
   if(route.steps.some(s=>s.action==='interact')){api.reset();api.start();try{await run(true,route.steps);}catch(e){if(e.message!=='No traversable route')throw e;}await tick(runtime.session.durationSeconds+.1);check('alternative requires interaction '+route.id,api.snapshot().mode==='lost');}
  }
  observe=false;api.reset();api.start();await tick(runtime.session.durationSeconds+.1);check('idle does not win',api.snapshot().mode==='lost');
  if(plan.steps.some(s=>s.action==='interact')){
   api.reset();api.start();try{await run(true);}catch(e){if(e.message!=='No traversable route')throw e;report.omittedRouteBlocked=true;}await tick(runtime.session.durationSeconds+.1);check('omitted interactions do not win',api.snapshot().mode==='lost');
  }
  report.conceptObservations=observations;
  for(const w of observations)check('concept changes during successful play '+w.branchId+'/'+w.instanceId,w.changed);
  report.domainAblations=[];
  for(const instanceId of new Set(observations.map(w=>w.instanceId))){
   const routes=[];
   for(const route of [{id:'primary',steps:plan.steps},...(plan.alternatives??[])]){
    api=createSceneEngine(runtime,{freezeInstances:[instanceId]}).n.arcade;api.start();let obstruction=null;
    try{await run(false,route.steps);}catch(e){if(!['No traversable route','Route endpoint lacks clearance','Planned waypoint unreachable through movement','Session ended before planned movement'].includes(e.message))throw e;obstruction=e.message;}
    await tick(runtime.session.durationSeconds+.1);const result=api.snapshot();routes.push({id:route.id,mode:result.mode,obstruction});
   }
   report.domainAblations.push({instanceId,intervention:'freeze domain at initial outputs',routes});
   check('removing domain prevents a demonstrated route '+instanceId,routes.some(r=>r.mode==='lost'));
  }
  report.status='PASS';
 }catch(e){if(signal?.aborted)throw e;report.error=e.message;}
 return report;
}
