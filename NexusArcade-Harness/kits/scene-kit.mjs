// Local optional NexusEngine kit. Upstream atoms own locomotion, activation, cargo and prerequisite state.
// This reusable adapter owns spatial support, explicit routing, session lifecycle and objective closure.
import {createEngine} from '../vendor/nexusengine/src/engine.js';
import {defineDomainServiceKit} from '../vendor/nexusengine/src/domain-service-kit.js';
import {createInteractionKit} from '../vendor/nexusengine/src/core-domains/interaction/kits/interaction-kit/index.js';
import {createEnvironmentalAffordanceKit} from '../vendor/nexusengine/src/core-domains/interaction/environmental-affordance/kits/environmental-affordance-kit/index.js';
import {createAssistanceTargetKit} from '../vendor/nexusengine/src/core-domains/interaction/assistance-target/kits/assistance-target-kit/index.js';
import {createTransferZoneKit} from '../vendor/nexusengine/src/core-domains/interaction/transfer-zone/kits/transfer-zone-kit/index.js';
import {createSimulationKit} from '../vendor/nexusengine/src/core-domains/simulation/kits/simulation-kit/index.js';
import {createMotionKit} from '../vendor/nexusengine/src/core-domains/simulation/motion/kits/motion-kit/index.js';
import {createActionLocomotionKit} from '../vendor/nexusengine/src/core-domains/simulation/motion/locomotion/kits/action-locomotion-kit/index.js';
import {createLifecycleProgressionKit} from '../vendor/nexusengine/src/core-domains/simulation/progression/lifecycle/kits/lifecycle-progression-kit/index.js';
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function segment(p,a,b){const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));return distance(p,{x:a.x+t*dx,z:a.z+t*dz});}
export function createCompositionEngine(c){
 const points=Object.fromEntries([['home',c.home],...c.nodes.map(n=>[n.id,n.position])]);
 const kit=defineDomainServiceKit({id:'arcade-spatial-composition-kit',stability:'experimental',version:'0.1.0',domain:'arcade-composition',domainPath:'n:arcade-composition',apiName:'arcade',provides:['n:arcade-composition'],requires:['n:interaction:environmental-affordance','n:simulation:motion:locomotion','n:simulation:progression:lifecycle'],createApi({engine}){
  const N=engine.n;let mode='title',elapsed=0,carry=null,message='',sequence=0,interactions=0,blocked=0;const op=()=>({operationId:'scene-'+(++sequence)});
  const completed=()=>N.lifecycleProgression.getState().completed;
  const available=n=>n.requires.every(x=>completed().includes(x));
  const finish=id=>N.lifecycleProgression.start({...op(),itemId:id});
  const support=p=>Object.values(points).some(x=>distance(p,x)<=3.3)||c.edges.some(e=>e.requires.every(x=>completed().includes(x))&&segment(p,points[e.a],points[e.b])<=1.4);
  function snapshot(){const player=N.actionLocomotion.getState().position;return {mode,elapsed,player,carry,message,interactions,blocked,completed:completed(),nodes:c.nodes.map(n=>({...n,available:available(n),complete:completed().includes(n.id),progress:N.environmentalAffordances.getState().affordances.find(a=>a.id===n.id)?.progress??0})),home:c.home,required:c.required,exit:c.exit,edges:c.edges,coordinates:'x right, y up, z toward camera; metres',engine:'NexusEngine',objective:c.goal};}
  return {snapshot,start(){if(mode==='title')mode='play';},pause(){if(mode==='play')mode='pause';else if(mode==='pause')mode='play';},reset(){N.actionLocomotion.reset();N.environmentalAffordances.reset();N.assistanceTargets.reset();N.transferZones.reset();N.lifecycleProgression.reset();mode='title';elapsed=0;carry=null;message='';interactions=0;blocked=0;},step(dt,input={}){
   if(!Number.isFinite(dt)||dt<0||dt>.051)throw Error('Invalid tick');if(mode==='pause')return;if(mode!=='play')return;
   engine.tick(dt);elapsed=Math.min(c.duration,elapsed+dt);const before=N.actionLocomotion.getState();const moving=input.x||input.z||Math.hypot(before.velocity.x,before.velocity.z)>.001;const frame=moving?N.actionLocomotion.step({...op(),delta:dt,input:{x:input.x??0,z:input.z??0},contact:{grounded:true,groundHeight:0}}).result:{position:before.position};
   // Tick receipts are not replay commands; retain only the latest 16 after consumption.
   if(sequence%16===0)N.actionLocomotion.update({operationReceipts:Object.fromEntries(Object.entries(N.actionLocomotion.getState().operationReceipts??{}).slice(-16))});
   if(!support(frame.position)){N.actionLocomotion.update({position:before.position,velocity:{x:0,y:0,z:0}});blocked++;}
   const p=N.actionLocomotion.getState().position;
   if(input.interact){
    if(carry&&distance(p,points[c.nodes.find(n=>n.id===carry).receiver])<2.3){const n=c.nodes.find(n=>n.id===carry);N.transferZones.transfer({...op(),zoneId:n.receiver,subjectId:carry,subjectType:'core',point:{x:p.x,y:p.z},dwellSeconds:0});N.assistanceTargets.complete({...op(),targetId:carry});finish(carry);carry=null;interactions++;message='Core received. Dependency completed.';}
    else{const n=c.nodes.filter(n=>!completed().includes(n.id)&&distance(p,n.position)<2.3).sort((a,b)=>distance(p,a.position)-distance(p,b.position))[0];
     if(n&&!available(n))message='Complete linked prerequisites first.';
     else if(n&&n.action==='carry'&&!carry){N.assistanceTargets.attach({...op(),targetId:n.id,carrierId:'player'});carry=n.id;interactions++;message='Carry the core to '+n.receiver.toUpperCase();}
     else if(n&&n.action!=='carry'){N.environmentalAffordances.activate({...op(),affordanceId:n.id,amount:n.action==='hold'?dt:1});if(N.environmentalAffordances.getState().affordances.find(a=>a.id===n.id).completed){finish(n.id);interactions++;message='Anchor online. New dependencies available.';}}
    }
   }
   if(c.required.every(x=>completed().includes(x))&&distance(p,points[c.exit])<2.5){mode='won';message='Objective complete. Extraction successful.';}
   else if(elapsed>=c.duration){mode='lost';message='Time expired. Restart and choose a faster route.';}
  }};
 }});
 return createEngine({kits:[createInteractionKit(),createSimulationKit(),createMotionKit(),createActionLocomotionKit({speed:c.speed,groundDrag:0,groundAcceleration:100,start:c.home}),createEnvironmentalAffordanceKit({affordances:c.nodes.filter(n=>n.action!=='carry').map(n=>({id:n.id,x:n.position.x,y:n.position.z,radius:2.3,target:n.seconds}))}),createAssistanceTargetKit({targets:c.nodes.filter(n=>n.action==='carry').map(n=>({id:n.id,x:n.position.x,y:n.position.z,decayPerSecond:0}))}),createTransferZoneKit({zones:Object.entries(points).map(([id,p])=>({id,x:p.x,y:p.z,radius:2.3,accepts:['core'],dwellSeconds:0}))}),createLifecycleProgressionKit({items:c.nodes.map(n=>({id:n.id,prerequisites:n.requires,durationSeconds:0}))}),kit]});
}
