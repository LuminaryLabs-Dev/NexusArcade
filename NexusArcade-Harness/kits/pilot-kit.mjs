import {createEngine} from '../vendor/nexusengine/src/engine.js';
import {defineDomainServiceKit} from '../vendor/nexusengine/src/domain-service-kit.js';
import {createSimulationKit} from '../vendor/nexusengine/src/core-domains/simulation/kits/simulation-kit/index.js';
import {createMotionKit} from '../vendor/nexusengine/src/core-domains/simulation/motion/kits/motion-kit/index.js';
import {createActionLocomotionKit} from '../vendor/nexusengine/src/core-domains/simulation/motion/locomotion/kits/action-locomotion-kit/index.js';
// Reusable local domain adapter: ownership/flow/steering are explicit state machines,
// never scripts supplied by a generated game or rendering callback.
export function createPilotEngine(c){
 const kit=defineDomainServiceKit({id:'arcade-pilot-domains',stability:'experimental',version:'0.1.0',domain:'arcade-pilots',domainPath:'n:arcade-pilots',apiName:'arcade',provides:['n:arcade-pilots'],requires:['n:simulation:motion:locomotion'],createApi({engine}){
 const N=engine.n;let mode='title',elapsed=0,carry=null,completed=[],rotation=c.nodes.map(n=>n.rotation??0),fill=0,heading=0,speed=0,sequence=0,pressed=false,events=[];
 const emit=(type,id)=>{events.push({type,id,at:elapsed});events=events.slice(-32);};
 const point=()=>N.actionLocomotion.getState().position;
 const d=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
 const snapshot=()=>({kind:c.kind,mode,elapsed,player:point(),carry,completed:[...completed],rotation:[...rotation],fill,heading,speed,events:[...events],nodes:c.nodes,objective:c.goal,coordinates:'x right, y up, z south; metres',engine:'NexusEngine with local pilot domains'});
 const reset=()=>{N.actionLocomotion.reset();mode='title';elapsed=0;carry=null;completed=[];rotation=c.nodes.map(n=>n.rotation??0);fill=0;heading=0;speed=0;pressed=false;events=[];};
 return {snapshot,reset,start(){if(mode==='title')mode='play';},pause(){if(mode==='play')mode='pause';else if(mode==='pause')mode='play';pressed=false;},step(dt,input={}){
 if(!Number.isFinite(dt)||dt<0||dt>.051)throw Error('Invalid domain tick');if(mode!=='play')return;engine.tick(dt);elapsed=Math.min(c.deadlineSeconds,elapsed+dt);
 let vx=input.x??0,vz=input.z??0;const before=point();
 if(c.kind==='rally'){const throttle=Math.max(-1,Math.min(1,-vz));speed=Math.max(0,Math.min(13,speed+(throttle>0?8:throttle<0?-18:-3)*dt));heading+=vx*Math.min(1.7,speed*.25)*dt;vx=Math.sin(heading)*speed/13;vz=Math.cos(heading)*speed/13;}
 const result=N.actionLocomotion.step({operationId:'pilot-'+(++sequence),delta:dt,input:{x:vx,z:vz},contact:{grounded:true,groundHeight:0}}).result;const p=result.position;
 const supported=c.kind==='rally'?Math.abs(Math.hypot(p.x,p.z)-18)<4:Math.abs(p.x)<14&&Math.abs(p.z)<14&&!(c.kind==='courier'&&Math.abs(p.x)>3&&Math.abs(p.x)<7&&Math.abs(p.z)<5);
 if(!supported){N.actionLocomotion.update({position:before,velocity:{x:0,y:0,z:0}});if(c.kind==='rally')speed*=.7;emit('collision','boundary');}
 if(sequence%16===0)N.actionLocomotion.update({operationReceipts:Object.fromEntries(Object.entries(N.actionLocomotion.getState().operationReceipts??{}).slice(-16))});
 const position=point(),edge=!!input.interact&&!pressed;pressed=!!input.interact;
 if(c.kind==='courier'&&edge){if(carry){const n=c.nodes.find(n=>n.id===carry);if(d(position,n.receiver)<2){completed.push(carry);emit('delivered',carry);carry=null;}}else{const n=c.nodes.find(n=>!completed.includes(n.id)&&d(position,n)<2);if(n){carry=n.id;emit('picked-up',n.id);}}}
 if(c.kind==='conduit'){if(edge){const i=c.nodes.findIndex(n=>d(position,n)<2.5);if(i>=0){rotation[i]=(rotation[i]+1)%4;emit('turned',c.nodes[i].id);}}const connected=c.nodes.every((n,i)=>rotation[i]===n.target);fill=Math.max(0,Math.min(1,fill+dt*(connected?1/c.fillSeconds:-.12)));if(fill===1)completed=c.nodes.map(n=>n.id);}
 if(c.kind==='rally'){const next=c.nodes[completed.length];if(next&&d(position,next)<2.7){completed.push(next.id);emit('checkpoint',next.id);}}
 if(completed.length===c.nodes.length){mode='won';emit('won','session');}else if(elapsed>=c.deadlineSeconds){mode='lost';emit('lost','session');}
 }};
 }});
 return createEngine({kits:[createSimulationKit(),createMotionKit(),createActionLocomotionKit({speed:c.kind==='rally'?13:6,groundDrag:0,groundAcceleration:100,start:c.playerStart}),kit]});
}
