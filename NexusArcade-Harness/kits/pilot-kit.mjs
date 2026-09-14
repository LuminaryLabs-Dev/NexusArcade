import {createSceneEngine} from './scene-runtime.mjs';
import {trackRoads,rallyVehicle} from './track-layout.mjs';
import {domainDefinitions} from './domain-graph.mjs';

// Compatibility mapping for existing profiles. Gameplay runs only in the shared
// scene session; this wrapper preserves the existing player/reviewer readouts.
export function pilotRuntime(c){
 const movement=c.track?{adapter:'steering',settings:Object.fromEntries(['maxSpeed','acceleration','braking','turnRate'].map(k=>[k,c.handling[k]])),start:c.playerStart,heading:c.headingStart??0}:{adapter:'walk',settings:{speed:6},start:c.playerStart,heading:c.headingStart??0};
 const collision=c.spatialWorld?{adapter:'world',world:c.spatialWorld}:{adapter:'roads',roads:trackRoads(c.track,c.shortcut).map(r=>({...r,points:r.points.map(({x,z})=>({x,z}))})),vehicle:c.vehicle??rallyVehicle};
 const failurePorts=c.domainGraph.instances.filter(n=>domainDefinitions[n.capability].outputs.failed==='boolean').map(n=>({instance:n.id,port:'failed'}));
 return {version:1,domainGraph:c.domainGraph,movement,collision,session:{durationSeconds:c.deadlineSeconds,failurePorts}};
}
export function createPilotEngine(c,options){
 const engine=createSceneEngine(pilotRuntime(c),options),snapshot=engine.n.arcade.snapshot;
 engine.n.arcade.snapshot=()=>{const s=snapshot(),d=s.domainState;return {...s,kind:c.kind,carry:d.delivery?.carry??null,completed:d.delivery?.completed??d.gates?.completed??(d.objective.complete?c.nodes.map(n=>n.id):[]),rotation:c.nodes.map(n=>d[n.id]?.rotation??0),fill:d.reservoir?.fill??0,nodes:c.nodes,objective:c.goal,coordinates:'x right, y up, z south; metres',engine:'NexusEngine with typed local domain composition',spatialWorld:c.spatialWorld??null,replay:c.replay??null,events:s.events.map(e=>e.type==='lost'&&e.id==='resource-goal'?{...e,id:'waste-capacity'}:e)};};
 return engine;
}
