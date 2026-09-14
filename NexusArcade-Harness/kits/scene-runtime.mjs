import {validateWorld,worldSupports} from './spatial-world.mjs';
import {compileDomainGraph,domainDefinitions,createDomainGraphKit} from './domain-graph.mjs';
import {vehicleSupported,vehicleSweepSupported} from './track-layout.mjs';
import {createEngine} from '../vendor/nexusengine/src/engine.js';
import {defineDomainServiceKit} from '../vendor/nexusengine/src/domain-service-kit.js';
import {createSimulationKit} from '../vendor/nexusengine/src/core-domains/simulation/kits/simulation-kit/index.js';
import {createMotionKit} from '../vendor/nexusengine/src/core-domains/simulation/motion/kits/motion-kit/index.js';
import {createActionLocomotionKit} from '../vendor/nexusengine/src/core-domains/simulation/motion/locomotion/kits/action-locomotion-kit/index.js';

const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const finite=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
const point=p=>exact(p,['x','z'])&&finite(p.x,-100,100)&&finite(p.z,-100,100);
const motions={
 walk:{validate:s=>exact(s,['speed'])&&finite(s.speed,2,12),speed:s=>s.speed,step:(s,input)=>({...s,x:input.x,z:input.z})},
 steering:{validate:s=>exact(s,['maxSpeed','acceleration','braking','turnRate'])&&finite(s.maxSpeed,2,30)&&finite(s.acceleration,.1,30)&&finite(s.braking,.1,60)&&finite(s.turnRate,.1,10),speed:s=>s.maxSpeed,step:(state,input,dt,h)=>{
  const throttle=-input.z,speed=state.speed,acceleration=throttle>0?(speed<0?h.braking:h.acceleration):throttle<0?(speed>0?-h.braking:-h.acceleration*.6):-Math.sign(speed)*Math.min(3,Math.abs(speed)/Math.max(dt,1e-6));
  const next=Math.max(-h.maxSpeed*.35,Math.min(h.maxSpeed,speed+acceleration*dt)),heading=state.heading-input.x*Math.min(h.turnRate,Math.abs(next)*.25)*Math.sign(next)*dt;
  return {speed:next,heading,x:Math.sin(heading)*next/h.maxSpeed,z:Math.cos(heading)*next/h.maxSpeed};
 }}
};
const supports={
 world:(c,before,next,beforeHeading,heading,states)=>{const steps=Math.max(1,Math.ceil(Math.hypot(next.x-before.x,next.z-before.z)/.05));for(let i=1;i<=steps;i++)if(!worldSupports(c.world,{x:before.x+(next.x-before.x)*i/steps,z:before.z+(next.z-before.z)*i/steps},states))return false;return true;},
 roads:(c,before,next,beforeHeading,heading)=>vehicleSweepSupported(c.roads,before,next,beforeHeading,heading,c.vehicle)
};
export function validateSceneRuntime(scene){
 if(!exact(scene,['version','domainGraph','movement','collision','session'])||scene.version!==1)throw Error('Invalid scene runtime');compileDomainGraph(scene.domainGraph);
 const m=scene.movement;
 if(!exact(m,['adapter','settings','start','heading'])||typeof m.adapter!=='string'||!Object.hasOwn(motions,m.adapter)||!motions[m.adapter].validate(m.settings)||!exact(m.start,['x','y','z'])||m.start.y!==0||!finite(m.start.x,-100,100)||!finite(m.start.z,-100,100)||!finite(m.heading,-Math.PI*2,Math.PI*2))throw Error('Unsupported movement adapter/settings');
 const c=scene.collision;
 if(c?.adapter==='world'){
  if(!exact(c,['adapter','world'])||m.adapter!=='walk')throw Error('Incompatible world collision');validateWorld(c.world,scene.domainGraph);
 }else if(c?.adapter==='roads'){
  if(!exact(c,['adapter','roads','vehicle'])||m.adapter!=='steering'||!exact(c.vehicle,['width','length'])||!finite(c.vehicle.width,.2,5)||!finite(c.vehicle.length,.2,10)||!Array.isArray(c.roads)||c.roads.length<1||c.roads.length>8)throw Error('Invalid road collision');
  const ids=new Set();for(const road of c.roads){if(!exact(road,['id','width','points'])||typeof road.id!=='string'||!/^[a-z][a-z0-9-]{0,39}$/.test(road.id)||ids.has(road.id)||!finite(road.width,1,20)||!Array.isArray(road.points)||road.points.length<2||road.points.length>513||!road.points.every(point)||road.points.slice(1).some((p,i)=>Math.hypot(p.x-road.points[i].x,p.z-road.points[i].z)<1e-8))throw Error('Invalid road geometry');ids.add(road.id);}
 }else throw Error('Unknown collision adapter');
 const session=scene.session;
 if(!exact(session,['durationSeconds','failurePorts'])||!finite(session.durationSeconds,1,600)||!Array.isArray(session.failurePorts)||session.failurePorts.length>32)throw Error('Invalid session');
 const seen=new Set();for(const ref of session.failurePorts){const n=scene.domainGraph.instances.find(n=>n.id===ref?.instance),key=JSON.stringify([ref?.instance,ref?.port]);if(!exact(ref,['instance','port'])||!n||domainDefinitions[n.capability].outputs[ref.port]!=='boolean'||seen.has(key))throw Error('Invalid failure port');seen.add(key);}
 for(const n of scene.domainGraph.instances)if(domainDefinitions[n.capability].outputs.failed==='boolean'&&!seen.has(JSON.stringify([n.id,'failed'])))throw Error('Unbound domain failure '+n.id);
 return scene;
}

// Configured adapters and authoritative graph outputs own the session. There are
// no game-family branches or executable callbacks supplied by generated data.
export function createSceneEngine(config,{bestSeconds=null,freezeInstances=[]}={}){
 const c=structuredClone(validateSceneRuntime(config)),motion=motions[c.movement.adapter],supportsMove=supports[c.collision.adapter];
 if(bestSeconds!==null&&(!Number.isFinite(bestSeconds)||bestSeconds<=0||bestSeconds>c.session.durationSeconds))throw Error('Invalid prior record');let best=bestSeconds,lastResult=null;
 const kit=defineDomainServiceKit({id:'arcade-scene-session',stability:'experimental',version:'0.1.0',domain:'arcade-scene',domainPath:'n:arcade-scene',apiName:'arcade',provides:['n:arcade-scene'],requires:['n:simulation:motion:locomotion','n:arcade-composition'],createApi({engine}){
  const N=engine.n;let mode='title',elapsed=0,heading=c.movement.heading,speed=0,sequence=0,pressed=false,events=[];
  const point=()=>N.actionLocomotion.getState().position,emit=(type,id)=>{events.push({type,id,at:elapsed});events=events.slice(-32);};
  const snapshot=()=>({mode,elapsed,player:point(),heading,speed,events:structuredClone(events),domainState:N.composition.snapshot(),bestSeconds:best,lastResult:structuredClone(lastResult)});
  const reset=()=>{N.actionLocomotion.reset();N.composition.reset();mode='title';elapsed=0;heading=c.movement.heading;speed=0;pressed=false;events=[];lastResult=null;};
  return {snapshot,reset,start(){if(mode==='title')mode='play';},pause(){if(mode==='play')mode='pause';else if(mode==='pause')mode='play';pressed=false;},step(dt,input={}){
   if(!finite(dt,0,.051)||!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['x','z','interact'].includes(k))||(Object.hasOwn(input,'x')&&!finite(input.x,-1,1))||(Object.hasOwn(input,'z')&&!finite(input.z,-1,1))||(input.interact!==undefined&&typeof input.interact!=='boolean'))throw Error('Invalid scene input');
   if(mode!=='play')return;engine.tick(dt);elapsed=Math.min(c.session.durationSeconds,elapsed+dt);
   const before=point(),beforeHeading=heading,next=motion.step({heading,speed},{x:input.x??0,z:input.z??0},dt,c.movement.settings);heading=next.heading;speed=next.speed;
   const p=N.actionLocomotion.step({operationId:'scene-'+(++sequence),delta:dt,input:{x:next.x,z:next.z},contact:{grounded:true,groundHeight:0}}).result.position;
   if(!supportsMove(c.collision,before,p,beforeHeading,heading,N.composition.snapshot())){N.actionLocomotion.update({position:before,velocity:{x:0,y:0,z:0}});speed*=.7;heading=beforeHeading;emit('collision','boundary');}
   if(sequence%16===0)N.actionLocomotion.update({operationReceipts:Object.fromEntries(Object.entries(N.actionLocomotion.getState().operationReceipts??{}).slice(-16))});
   const position=point(),action=!!input.interact&&!pressed;pressed=!!input.interact;
   const result=N.composition.step(dt,{position:{x:position.x,z:position.z},action});for(const event of result.events)emit(event.type,event.id);
   const failure=c.session.failurePorts.find(ref=>result.states[ref.instance][ref.port]===true);
   if(failure){mode='lost';emit('lost',failure.instance);}
   else if(result.complete){mode='won';lastResult={seconds:elapsed,previousBest:best,improvement:best===null?null:best-elapsed,personalBest:best===null||elapsed<best};best=best===null?elapsed:Math.min(best,elapsed);emit('won','session');}
   else if(elapsed>=c.session.durationSeconds){mode='lost';emit('lost','session');}
  }};
 }});
 const engine=createEngine({kits:[createSimulationKit(),createMotionKit(),createActionLocomotionKit({speed:motion.speed(c.movement.settings),groundDrag:0,groundAcceleration:100,start:c.movement.start}),createDomainGraphKit(c.domainGraph,{freezeInstances}),kit]});
 const initial=engine.n.arcade.snapshot(),supported=c.collision.adapter==='roads'?vehicleSupported(c.collision.roads,initial.player,initial.heading,c.collision.vehicle):worldSupports(c.collision.world,initial.player,initial.domainState);
 if(!supported)throw Error('Player start is unsupported');return engine;
}
