import {readFileSync} from 'node:fs';
import {pilotProfile,validatePilot} from './pilot-spec.mjs';
import {pilotDomainGraph,compileDomainGraph} from './kits/domain-graph.mjs';
import {flowWorld,flowNodes} from './kits/flow-layout.mjs';
import {trackFrame,trackGates} from './kits/track-layout.mjs';
import {validateProfile,profileDigest} from './roller.mjs';
const options=JSON.parse(readFileSync(new URL('./pilot-options.json',import.meta.url)));
export function compileProfile(profile){validateProfile(profile);if(profile.gaps.length)throw Error('Unresolved required gaps: '+profile.gaps.map(g=>g.id).join(', '));if(!['conduit','rally'].includes(profile.family))throw Error('Unimplemented runtime family');const b=profile.bindings,c=pilotProfile(profile.family,profile.seed);const pick=(list,id)=>{const x=list.find(x=>x.id===id);if(!x)throw Error('Unimplemented adapter preset '+id);return structuredClone(x);};c.palette=b.palette;
 if(profile.family==='conduit'){c.flowLayout=pick(options.conduit.layouts,b.flowLayout);c.flowProcess=pick(options.conduit.processes,b.flowProcess);c.nodes=flowNodes(c.flowLayout);c.spatialWorld=flowWorld(c.flowLayout);if(![4,6].includes(b.walkSpeed))throw Error('Unsupported walk speed');c.walkSpeed=b.walkSpeed;}
 else{c.track={...pick(options.rally.tracks,b.track),width:b.width};c.handling=pick(options.rally.handling,b.handling);c.shortcut=pick(options.rally.shortcuts,b.shortcut);c.presentation=pick(options.rally.presentation,b.presentation);const start=trackFrame(c.track,0);c.playerStart={x:start.x,y:0,z:start.z};c.headingStart=start.heading;c.nodes=trackGates(c.track,c.shortcut);}
 c.selection={method:'roller-bindings',bindings:b,profileHash:profile.profileHash};c.domainGraph=pilotDomainGraph(c);compileDomainGraph(c.domainGraph);c.replay.recordKey=profileDigest({family:c.kind,bindings:b,graph:c.domainGraph});return validatePilot(c);}
