import {defineDomainServiceKit} from '../vendor/nexusengine/src/domain-service-kit.js';

// Trusted local NexusEngine domains. Generated data selects settings and wires;
// it never supplies functions. This registry is developmental, not catalog eligibility.
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const number=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
const point=p=>p&&Object.keys(p).every(k=>['x','z'].includes(k))&&number(p.x,-100,100)&&number(p.z,-100,100);
const exact=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).length===keys.length&&keys.every(k=>Object.hasOwn(o,k));
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,39}$/.test(x);
const event=(type,id)=>({type,id});
const nodes=xs=>Array.isArray(xs)&&xs.length>0&&xs.length<=64&&new Set(xs.map(n=>n.id)).size===xs.length&&xs.every(n=>id(n.id)&&number(n.x,-100,100)&&number(n.z,-100,100));
const input=(type,many=false)=>({type,many});
export const domainDefinitions={
 controls:{inputs:{},outputs:{position:'position',action:'boolean'},settings:s=>exact(s,[]),initial:()=>({}),step:(s,p,i,dt,external)=>external},
 delivery:{inputs:{position:input('position'),action:input('boolean')},outputs:{completed:'ids',carry:'cargo',complete:'boolean',events:'events'},settings:s=>exact(s,['nodes','range'])&&nodes(s.nodes)&&s.nodes.every(n=>exact(n,['id','x','z','receiver'])&&point(n.receiver))&&number(s.range,.5,3),initial:()=>({completed:[],carry:null,complete:false,events:[]}),step:(s,p,i)=>{const out={...s,completed:[...s.completed],events:[]};if(i.action){if(out.carry){const n=p.nodes.find(n=>n.id===out.carry);if(distance(i.position,n.receiver)<p.range){out.completed.push(n.id);out.events.push(event('delivered',n.id));out.carry=null;}}else{const n=p.nodes.find(n=>!out.completed.includes(n.id)&&distance(i.position,n)<p.range);if(n){out.carry=n.id;out.events.push(event('picked-up',n.id));}}}out.complete=out.completed.length===p.nodes.length;return out;}},
 valve:{inputs:{position:input('position'),action:input('boolean')},outputs:{rotation:'number',aligned:'boolean',events:'events'},settings:s=>exact(s,['id','position','initial','target','range'])&&id(s.id)&&point(s.position)&&[0,1,2,3].includes(s.initial)&&[0,1,2,3].includes(s.target)&&number(s.range,.5,3),initial:p=>({rotation:p.initial,aligned:p.initial===p.target,events:[]}),step:(s,p,i)=>{const turn=i.action&&distance(i.position,p.position)<p.range,rotation=(s.rotation+Number(turn))%4;return {rotation,aligned:rotation===p.target,events:turn?[event('turned',p.id)]:[]};}},
 all:{inputs:{values:input('boolean',true)},outputs:{complete:'boolean'},settings:s=>exact(s,[]),initial:()=>({complete:false}),step:(s,p,i)=>({complete:i.values.every(Boolean)})},
 reservoir:{inputs:{connected:input('boolean')},outputs:{fill:'number',complete:'boolean'},settings:s=>exact(s,['fillSeconds','drainRate'])&&number(s.fillSeconds,1,60)&&number(s.drainRate,0,1),initial:()=>({fill:0,complete:false}),step:(s,p,i,dt)=>{const fill=Math.max(0,Math.min(1,s.fill+dt*(i.connected?1/p.fillSeconds:-p.drainRate)));return {fill,complete:fill===1};}},
 checkpoints:{inputs:{position:input('position')},outputs:{completed:'ids',complete:'boolean',events:'events'},settings:s=>exact(s,['nodes','range'])&&nodes(s.nodes)&&s.nodes.every(n=>exact(n,['id','x','z']))&&number(s.range,.5,4),initial:()=>({completed:[],complete:false,events:[]}),step:(s,p,i)=>{const out={...s,completed:[...s.completed],events:[]},next=p.nodes[s.completed.length];if(next&&distance(i.position,next)<p.range){out.completed.push(next.id);out.events.push(event('checkpoint',next.id));}out.complete=out.completed.length===p.nodes.length;return out;}},
 objective:{inputs:{complete:input('boolean')},outputs:{complete:'boolean'},settings:s=>exact(s,[]),initial:()=>({complete:false}),step:(s,p,i)=>({complete:i.complete})}
};
function validValue(value,type){
 if(type==='position')return value&&number(value.x,-100,100)&&number(value.z,-100,100);
 if(type==='boolean')return typeof value==='boolean';
 if(type==='number')return Number.isFinite(value);
 if(type==='ids')return Array.isArray(value)&&value.every(id)&&new Set(value).size===value.length;
 if(type==='cargo')return value===null||id(value);
 if(type==='events')return Array.isArray(value)&&value.length<=64&&value.every(e=>exact(e,['type','id'])&&id(e.type)&&id(e.id));
 return false;
}
export function compileDomainGraph(graph){
 graph=structuredClone(graph);
 if(!exact(graph,['version','instances','wires','objective'])||graph.version!==1||!Array.isArray(graph.instances)||graph.instances.length<2||graph.instances.length>128||!Array.isArray(graph.wires)||graph.wires.length>512)throw Error('Invalid domain graph');
 const byId=new Map(),incoming=new Map(),outgoing=new Map(),degrees=new Map();
 for(const n of graph.instances){const d=domainDefinitions[n.capability];if(!exact(n,['id','capability','version','settings'])||!id(n.id)||byId.has(n.id)||!d||n.version!==1||!d.settings(n.settings))throw Error('Unknown or invalid domain instance '+n.id);byId.set(n.id,n);incoming.set(n.id,[]);outgoing.set(n.id,[]);degrees.set(n.id,0);}
 if(byId.get(graph.objective)?.capability!=='objective'||graph.instances.filter(n=>n.capability==='controls').length!==1||graph.instances.filter(n=>n.capability==='objective').length!==1)throw Error('Expected one controls source and one objective');
 const seen=new Set();for(const w of graph.wires){
  if(!exact(w,['from','out','to','in','delay'])||![0,1].includes(w.delay))throw Error('Invalid wire');
  const a=byId.get(w.from),b=byId.get(w.to),type=a&&domainDefinitions[a.capability].outputs[w.out],target=b&&domainDefinitions[b.capability].inputs[w.in];
  if(!type||!target||type!==target.type)throw Error('Unknown or mismatched port');
  const key=JSON.stringify([w.from,w.out,w.to,w.in]);if(seen.has(key))throw Error('Duplicate wire');seen.add(key);
  if(!target.many&&incoming.get(w.to).some(x=>x.in===w.in))throw Error('Multiple writers to single input');
  if(w.delay&&!validValue(domainDefinitions[a.capability].initial(a.settings)[w.out],type))throw Error('Delayed port lacks initial value');
  incoming.get(w.to).push(w);outgoing.get(w.from).push(w);if(!w.delay)degrees.set(w.to,degrees.get(w.to)+1);
 }
 for(const n of graph.instances)for(const name of Object.keys(domainDefinitions[n.capability].inputs))if(!incoming.get(n.id).some(w=>w.in===name))throw Error('Unbound required port '+n.id+'/'+name);
 const order=[],ready=[...degrees].filter(([,n])=>!n).map(([id])=>id).sort();
 while(ready.length){const next=ready.shift();order.push(next);for(const w of outgoing.get(next).filter(w=>!w.delay)){degrees.set(w.to,degrees.get(w.to)-1);if(!degrees.get(w.to)){ready.push(w.to);ready.sort();}}}
 if(order.length!==byId.size)throw Error('Zero-delay domain cycle');
 const contributes=new Set([graph.objective]),visit=[graph.objective];while(visit.length){for(const w of incoming.get(visit.pop()))if(!contributes.has(w.from)){contributes.add(w.from);visit.push(w.from);}}
 if(contributes.size!==byId.size)throw Error('Domain does not contribute to objective');
 const valves=graph.instances.filter(n=>n.capability==='valve');for(let a=0;a<valves.length;a++)for(let b=a+1;b<valves.length;b++)if(distance(valves[a].settings.position,valves[b].settings.position)<valves[a].settings.range+valves[b].settings.range)throw Error('Ambiguous overlapping valve interactions');
 return {graph:structuredClone(graph),order,incoming};
}
export function createDomainGraphKit(graph){
 const compiled=compileDomainGraph(graph),byId=new Map(compiled.graph.instances.map(n=>[n.id,n]));
 return defineDomainServiceKit({id:'arcade-composed-behaviors',domain:'arcade-composition',domainPath:'n:arcade-composition',apiName:'composition',stability:'experimental',version:'0.1.0',provides:['n:arcade-composition'],createApi(){
  let states;const reset=()=>{states=Object.fromEntries([...byId].map(([id,n])=>[id,domainDefinitions[n.capability].initial(n.settings)]));};reset();
  return {reset,snapshot:()=>structuredClone(states),step(dt,external){
   if(!number(dt,0,.051)||!validValue(external.position,'position')||!validValue(external.action,'boolean'))throw Error('Invalid graph input');
   external=structuredClone(external);const before=structuredClone(states),next={...states};
   for(const id of compiled.order){const n=byId.get(id),d=domainDefinitions[n.capability],inputs={};
    for(const [name,port] of Object.entries(d.inputs)){const values=compiled.incoming.get(id).filter(w=>w.in===name).map(w=>(w.delay?before:next)[w.from][w.out]);if(values.some(v=>!validValue(v,port.type)))throw Error('Invalid typed input '+id+'/'+name);inputs[name]=port.many?values:values[0];}
    const result=d.step(before[id],n.settings,inputs,dt,external);for(const [name,type] of Object.entries(d.outputs))if(!validValue(result[name],type))throw Error('Invalid domain output '+id+'/'+name);next[id]=result;
   }
   states=next;return {complete:states[compiled.graph.objective].complete,states:structuredClone(states),events:compiled.order.flatMap(id=>states[id].events??[])};
  }};
 }});
}
export function pilotDomainGraph(c){
 const instances=[{id:'controls',capability:'controls',version:1,settings:{}}],wires=[];
 const add=(id,capability,settings)=>instances.push({id,capability,version:1,settings});
 const wire=(from,out,to,input,delay=0)=>wires.push({from,out,to,in:input,delay});
 const bindAction=id=>{wire('controls','position',id,'position');wire('controls','action',id,'action');};
 if(c.kind==='courier'){add('delivery','delivery',{nodes:c.nodes,range:2});bindAction('delivery');wire('delivery','complete','objective','complete');}
 else if(c.kind==='conduit'){for(const n of c.nodes){add(n.id,'valve',{id:n.id,position:{x:n.x,z:n.z},initial:n.rotation,target:n.target,range:2.5});bindAction(n.id);wire(n.id,'aligned','junction','values');}add('junction','all',{});add('reservoir','reservoir',{fillSeconds:c.fillSeconds,drainRate:.12});wire('junction','complete','reservoir','connected');wire('reservoir','complete','objective','complete');}
 else if(c.kind==='rally'){add('gates','checkpoints',{nodes:c.nodes.map(({id,x,z})=>({id,x,z})),range:2.7});wire('controls','position','gates','position');wire('gates','complete','objective','complete');}
 else throw Error('Unknown pilot graph mapping');
 add('objective','objective',{});const graph={version:1,instances,wires,objective:'objective'};compileDomainGraph(graph);return graph;
}
