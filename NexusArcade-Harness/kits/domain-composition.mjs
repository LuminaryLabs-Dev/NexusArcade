import {compileDomainGraph,domainDefinitions} from './domain-graph.mjs';

const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const finite=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
const optionId=x=>typeof x==='string'&&/^[a-z][a-z0-9_.-]{0,119}$/.test(x);
const positioned=new Set(['valve','delivery','checkpoints']);

// Lower prefab-local settings into the existing trusted domain graph. No scripts,
// inferred ports, implicit connections or claims of catalog eligibility.
export function compileDomainComposition(composition){
 if(!exact(composition,['version','domainInstances','connections','objective'])||composition.version!==1||!Array.isArray(composition.domainInstances)||composition.domainInstances.length>128)throw Error('Invalid domain composition');
 const provenance=[],instances=composition.domainInstances.map(n=>{
  if(!exact(n,['id','capabilityId','capabilityVersion','settings','transform','sourceOptionIds'])||n.capabilityVersion!==1||typeof n.capabilityId!=='string'||!Object.hasOwn(domainDefinitions,n.capabilityId))throw Error('Unknown composition capability');
  const t=n.transform;
  if(!exact(t,['x','y','z','yaw'])||!finite(t.x,-100,100)||!finite(t.z,-100,100)||t.y!==0||!finite(t.yaw,-Math.PI,Math.PI))throw Error('Unsupported transform: current spatial domains require the ground plane');
  if(!Array.isArray(n.sourceOptionIds)||n.sourceOptionIds.length>16||new Set(n.sourceOptionIds).size!==n.sourceOptionIds.length||!n.sourceOptionIds.every(optionId))throw Error('Invalid source options');
  const definition=domainDefinitions[n.capabilityId];if(!definition.settings(n.settings))throw Error('Invalid local capability settings '+n.id);
  const settings=structuredClone(n.settings),transform=p=>({x:t.x+p.x*Math.cos(t.yaw)+p.z*Math.sin(t.yaw),z:t.z-p.x*Math.sin(t.yaw)+p.z*Math.cos(t.yaw)});
  if(n.capabilityId==='valve')settings.position=transform(settings.position);
  if(['delivery','checkpoints'].includes(n.capabilityId))settings.nodes=settings.nodes.map(p=>({...p,...transform(p),...(p.receiver?{receiver:transform(p.receiver)}:{})}));
  provenance.push({id:n.id,capabilityId:n.capabilityId,capabilityVersion:n.capabilityVersion,transform:structuredClone(t),sourceOptionIds:[...n.sourceOptionIds],spatialBehavior:positioned.has(n.capabilityId)});
  return {id:n.id,capability:n.capabilityId,version:n.capabilityVersion,settings};
 });
 const graph={version:1,instances,wires:structuredClone(composition.connections),objective:composition.objective};
 compileDomainGraph(graph);return {graph,provenance};
}
