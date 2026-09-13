import {validateWorld,worldSupports} from './spatial-world.mjs';
import {createDomainGraphKit} from './domain-graph.mjs';
import {trackSegments,distanceToTrack} from './track-layout.mjs';
import {createEngine} from '../vendor/nexusengine/src/engine.js';
import {defineDomainServiceKit} from '../vendor/nexusengine/src/domain-service-kit.js';
import {createSimulationKit} from '../vendor/nexusengine/src/core-domains/simulation/kits/simulation-kit/index.js';
import {createMotionKit} from '../vendor/nexusengine/src/core-domains/simulation/motion/kits/motion-kit/index.js';
import {createActionLocomotionKit} from '../vendor/nexusengine/src/core-domains/simulation/motion/locomotion/kits/action-locomotion-kit/index.js';
// Reusable local domain adapter: ownership/flow/steering are explicit state machines,
// never scripts supplied by a generated game or rendering callback.
export function createPilotEngine(c,{bestSeconds=null}={}){
 if(bestSeconds!==null&&(!Number.isFinite(bestSeconds)||bestSeconds<=0||bestSeconds>c.deadlineSeconds))throw Error('Invalid prior record');
 if(c.spatialWorld)validateWorld(c.spatialWorld,c.domainGraph);
 const road=c.track?trackSegments(c.track):null,handling=c.handling??{maxSpeed:13,acceleration:8,braking:18,turnRate:1.7};
 let best=bestSeconds,lastResult=null;
 const kit=defineDomainServiceKit({id:'arcade-pilot-domains',stability:'experimental',version:'0.1.0',domain:'arcade-pilots',domainPath:'n:arcade-pilots',apiName:'arcade',provides:['n:arcade-pilots'],requires:['n:simulation:motion:locomotion','n:arcade-composition'],createApi({engine}){
 const N=engine.n;let mode='title',elapsed=0,carry=null,completed=[],rotation=c.nodes.map(n=>n.rotation??0),fill=0,heading=c.headingStart??0,speed=0,sequence=0,pressed=false,events=[];
 const emit=(type,id)=>{events.push({type,id,at:elapsed});events=events.slice(-32);};
 const point=()=>N.actionLocomotion.getState().position;
 const snapshot=()=>({kind:c.kind,mode,elapsed,player:point(),carry,completed:[...completed],rotation:[...rotation],fill,heading,speed,events:[...events],nodes:c.nodes,objective:c.goal,coordinates:'x right, y up, z south; metres',engine:'NexusEngine with typed local domain composition',domainState:N.composition.snapshot(),spatialWorld:c.spatialWorld??null,bestSeconds:best,lastResult,replay:c.replay??null});
 const reset=()=>{N.actionLocomotion.reset();N.composition.reset();mode='title';elapsed=0;carry=null;completed=[];rotation=c.nodes.map(n=>n.rotation??0);fill=0;heading=c.headingStart??0;speed=0;pressed=false;events=[];lastResult=null;};
 return {snapshot,reset,start(){if(mode==='title')mode='play';},pause(){if(mode==='play')mode='pause';else if(mode==='pause')mode='play';pressed=false;},step(dt,input={}){
 if(!Number.isFinite(dt)||dt<0||dt>.051)throw Error('Invalid domain tick');if(mode!=='play')return;engine.tick(dt);elapsed=Math.min(c.deadlineSeconds,elapsed+dt);
 let vx=input.x??0,vz=input.z??0;const before=point();
 if(c.kind==='rally'){const throttle=Math.max(-1,Math.min(1,-vz));speed=Math.max(0,Math.min(handling.maxSpeed,speed+(throttle>0?handling.acceleration:throttle<0?-handling.braking:-3)*dt));heading+=vx*Math.min(handling.turnRate,speed*.25)*dt;vx=Math.sin(heading)*speed/handling.maxSpeed;vz=Math.cos(heading)*speed/handling.maxSpeed;}
 const result=N.actionLocomotion.step({operationId:'pilot-'+(++sequence),delta:dt,input:{x:vx,z:vz},contact:{grounded:true,groundHeight:0}}).result;const p=result.position;
 const supported=c.spatialWorld?worldSupports(c.spatialWorld,p,N.composition.snapshot()):c.kind==='rally'?(road?distanceToTrack(road,p)<c.track.width/2:Math.abs(Math.hypot(p.x,p.z)-18)<4):Math.abs(p.x)<14&&Math.abs(p.z)<14&&!(c.kind==='transfer'&&Math.abs(p.x)>3&&Math.abs(p.x)<7&&Math.abs(p.z)<5);
 if(!supported){N.actionLocomotion.update({position:before,velocity:{x:0,y:0,z:0}});if(c.kind==='rally')speed*=.7;emit('collision','boundary');}
 if(sequence%16===0)N.actionLocomotion.update({operationReceipts:Object.fromEntries(Object.entries(N.actionLocomotion.getState().operationReceipts??{}).slice(-16))});
 const position=point(),edge=!!input.interact&&!pressed;pressed=!!input.interact;
 const composed=N.composition.step(dt,{position:{x:position.x,z:position.z},action:edge}),domainState=composed.states;
 carry=domainState.delivery?.carry??null;fill=domainState.reservoir?.fill??0;
 rotation=c.nodes.map(n=>domainState[n.id]?.rotation??0);
 completed=domainState.delivery?.completed??domainState.gates?.completed??(composed.complete?c.nodes.map(n=>n.id):[]);
 for(const e of composed.events)emit(e.type,e.id);
 if(composed.complete){mode='won';lastResult={seconds:elapsed,previousBest:best,improvement:best===null?null:best-elapsed,personalBest:best===null||elapsed<best};best=best===null?elapsed:Math.min(best,elapsed);emit('won','session');}else if(domainState['resource-goal']?.failed||elapsed>=c.deadlineSeconds){mode='lost';emit('lost',domainState['resource-goal']?.failed?'waste-capacity':'session');}
 }};
 }});
 return createEngine({kits:[createSimulationKit(),createMotionKit(),createActionLocomotionKit({speed:c.kind==='rally'?handling.maxSpeed:6,groundDrag:0,groundAcceleration:100,start:c.playerStart}),createDomainGraphKit(c.domainGraph),kit]});
}
