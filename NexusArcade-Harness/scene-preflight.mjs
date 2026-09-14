import {createSceneEngine} from './kits/scene-runtime.mjs';
import {routeInWorld,worldSupports} from './kits/spatial-world.mjs';
import {validateScenePlan} from './scene-spec.mjs';
import {digest} from './factory.mjs';

// Execute ordinary movement/action inputs before spending local inference time.
// This is a runtime feasibility check, never browser, novelty or player evidence.
export async function preflightScene(runtime,plan,{signal,deadlineAt=Date.now()+60000}={}){
 if(!Number.isFinite(deadlineAt))throw Error('Invalid preflight deadline');
 validateScenePlan(plan,runtime);
 if(runtime.movement.adapter!=='walk')throw Error('Scene preflight requires a supported movement driver');
 const api=createSceneEngine(runtime).n.arcade,world=runtime.collision.world;
 const report={status:'FAIL',method:'NexusEngine input simulation; no rendering or model review',runtimeHash:digest(runtime),planHash:digest(plan),checks:[],steps:0};
 const check=(name,pass)=>{report.checks.push({name,pass});if(!pass)throw Error(name);};
 const tick=async(seconds,input={})=>{for(let left=seconds;left>1e-9;left-=.05){if(report.steps%128===0)await new Promise(resolve=>setImmediate(resolve));signal?.throwIfAborted();if(Date.now()>=deadlineAt)throw Error('Preflight deadline exceeded');if(++report.steps>200000)throw Error('Preflight step bound exceeded');api.step(Math.min(.05,left),input);}};
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
 const run=async(omit=false)=>{for(const step of plan.steps){if(api.snapshot().mode!=='play')break;
  if(step.action==='move')await walk(step.x,step.z);
  else if(step.action==='interact'&&!omit)for(let i=0;i<step.count;i++){await tick(.05,{interact:true});await tick(.05);}
  else if(step.action==='wait')await tick(step.seconds);
 }return api.snapshot();};
 try{
  api.start();const won=await run();check('planned inputs complete the loop',won.mode==='won');report.winSeconds=won.elapsed;
  api.reset();api.start();check('restart clears session',api.snapshot().elapsed===0);const again=await run();check('repeated loop completes',again.mode==='won');check('same inputs reproduce time',Math.abs(again.elapsed-won.elapsed)<1e-8);
  api.reset();api.start();await tick(runtime.session.durationSeconds+.1);check('idle does not win',api.snapshot().mode==='lost');
  if(plan.steps.some(s=>s.action==='interact')){
   api.reset();api.start();try{await run(true);}catch(e){if(e.message!=='No traversable route')throw e;report.omittedRouteBlocked=true;}await tick(runtime.session.durationSeconds+.1);check('omitted interactions do not win',api.snapshot().mode==='lost');
  }
  report.status='PASS';
 }catch(e){if(signal?.aborted)throw e;report.error=e.message;}
 return report;
}
