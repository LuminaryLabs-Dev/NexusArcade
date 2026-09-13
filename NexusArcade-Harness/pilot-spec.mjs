import {readFileSync} from 'node:fs';
import {random} from './domains.mjs';
import {digest} from './factory.mjs';
import {trackFrame} from './kits/track-layout.mjs';
import {pilotDomainGraph,compileDomainGraph} from './kits/domain-graph.mjs';
const options=JSON.parse(readFileSync(new URL('./pilot-options.json',import.meta.url),'utf8'));
import {rollConcepts} from './composition.mjs';
export const pilotKinds=['courier','conduit','rally'];
export function pilotProfile(kind,seed){
 if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Invalid pilot seed');
 if(!pilotKinds.includes(kind))throw Error('Unknown pilot capability family');const rolled=rollConcepts(seed,2);
 const x={version:3,kind,seed,depth:2,concepts:rolled.concepts.map(x=>x.id),conceptRoll:rolled,deadlineSeconds:300,title:kind,palette:'lagoon',goal:'',controls:'',playerStart:{x:0,y:0,z:0}};
 if(kind==='courier')Object.assign(x,{goal:'Carry each energy cell into the matching numbered bay. One cell at a time.',controls:'WASD / arrows move · E pick up or deliver · Esc pause · R restart',playerStart:{x:0,y:0,z:12},nodes:[{id:'c0',x:-10,z:-8,receiver:{x:10,z:9}},{id:'c1',x:10,z:-8,receiver:{x:-10,z:9}},{id:'c2',x:0,z:-10,receiver:{x:0,z:10}}],view:'overhead',world:'warehouse'});
 if(kind==='conduit')Object.assign(x,{goal:'Turn all three valves toward the blue outlet arrows. Connected flow fills the reservoir.',controls:'WASD / arrows move · E turn nearby valve · Esc pause · R restart',playerStart:{x:0,y:0,z:12},nodes:[{id:'v0',x:-6,z:0,target:0,rotation:1},{id:'v1',x:0,z:0,target:1,rotation:3},{id:'v2',x:6,z:0,target:3,rotation:0}],fillSeconds:8,view:'first-person',world:'pump-room'});
 if(kind==='rally'){
  const rng=random(seed^0x714ac),pick=xs=>xs[Math.floor(rng()*xs.length)],track={...pick(options.rally.tracks),width:pick(options.rally.widths)},handling={...pick(options.rally.handling)},presentation={...pick(options.rally.presentation)},start=trackFrame(track,0);
  Object.assign(x,{goal:'Beat your best lap: clear every gate in order. Brake into bends and accelerate out.',controls:'W / ↑ accelerate · S / ↓ brake · A/D steer · Esc pause · R restart',playerStart:{x:start.x,y:0,z:start.z},headingStart:start.heading,track,handling,presentation,nodes:Array.from({length:16},(_,i)=>({id:'g'+i,...trackFrame(track,(i+1)/16)})),view:'chase',world:'canyon-circuit',selection:{catalogHash:digest(options),seed,track:track.id,width:track.width,handling:handling.id,presentation:presentation.id,method:'seeded-compatible-list-selection'}});
 }
 x.replay={mechanism:'personal-best',reason:'Improve completion time under the same course and rules.',recordKey:digest({kind,nodes:x.nodes,track:x.track,handling:x.handling,deadlineSeconds:x.deadlineSeconds,fillSeconds:x.fillSeconds})};
 x.domainGraph=pilotDomainGraph(x);return validatePilot(x);
}
export function validatePilot(c){compileDomainGraph(c.domainGraph);if(digest(c.domainGraph)!==digest(pilotDomainGraph(c)))throw Error('Pilot domain graph differs from seeded profile');if(c.version!==3||!pilotKinds.includes(c.kind)||c.deadlineSeconds!==300||!['lagoon','solar','violet','glacier','coral'].includes(c.palette))throw Error('Unsupported pilot profile');const ids=new Set();for(const n of c.nodes){if(ids.has(n.id)||!Number.isFinite(n.x)||!Number.isFinite(n.z)||Math.abs(n.x)>30||Math.abs(n.z)>30)throw Error('Invalid pilot instance');ids.add(n.id);}if(c.kind==='courier'&&(c.nodes.length!==3||c.nodes.some(n=>!n.receiver||!Number.isFinite(n.receiver.x)||!Number.isFinite(n.receiver.z))))throw Error('Invalid delivery contract');if(c.kind==='conduit'&&(c.nodes.length!==3||c.fillSeconds!==8||c.nodes.some(n=>![0,1,2,3].includes(n.target)||![0,1,2,3].includes(n.rotation))))throw Error('Invalid flow contract');if(c.kind==='rally'){if(c.nodes.length!==16||!options.rally.presentation.some(p=>Object.entries(p).every(([k,v])=>c.presentation?.[k]===v))||!options.rally.widths.includes(c.track?.width)||!options.rally.tracks.some(t=>Object.entries(t).every(([k,v])=>c.track[k]===v))||!options.rally.handling.some(h=>Object.entries(h).every(([k,v])=>c.handling?.[k]===v)))throw Error('Invalid seeded track contract');for(const [i,n] of c.nodes.entries()){const expected=trackFrame(c.track,(i+1)/16);if(Math.hypot(n.x-expected.x,n.z-expected.z)>.00001)throw Error('Checkpoint off track');}}return c;}
