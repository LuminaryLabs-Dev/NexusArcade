import {editorialSchema,interpretationSchema} from './composition.mjs';
import {validateShape} from './factory.mjs';
import {assertAllowedText} from './text-policy.mjs';

// Small models choose supported wording; they cannot invent an action for a
// compiled scene. This is editorial grounding, not proof of design quality.
export function sceneTextContracts(composition){
 const caps=new Set(composition.runtime.domainGraph.instances.map(n=>n.capability));
 const titles=caps.has('flowRouter')?['Split Current','Valve Circuit','Reservoir Routes','Flow Control']:['Connected Chambers','Linked Actions','Spatial Sequence'];
 if(composition.concepts.includes('dependency'))titles.push('Linked Locks','Conditional Current');
 assertAllowedText({titles,goal:composition.goal});
 const planner=structuredClone(interpretationSchema(1));planner.properties.intent={type:'string',enum:[composition.goal]};
 const writer=structuredClone(editorialSchema);writer.properties.title={type:'string',enum:titles};writer.properties.tagline={type:'string',enum:[composition.goal]};
 if(!writer.properties.palette.enum.includes(composition.presentation.theme))throw Error('Unsupported composed palette');
 writer.properties.palette={type:'string',enum:[composition.presentation.theme]};
 return {planner,writer,titles};
}

export function sceneImageSchema(composition){
 return {type:'object',additionalProperties:false,required:['geometry','labels','player'],properties:{
  geometry:{type:'string',enum:['visible','missing','uncertain']},
  labels:{type:'string',enum:['readable','unreadable','uncertain']},
  player:{type:'string',enum:composition.presentation.camera==='forward'?['not_required']:['visible','not_visible','uncertain']}
 }};
}
export function sceneImageVerdict(composition,facts){
 validateShape(facts,sceneImageSchema(composition));
 return {...facts,verdict:facts.geometry==='visible'&&facts.labels==='readable'&&['visible','not_required'].includes(facts.player)?'PASS':'FAIL'};
}

export const playerDetailSchema={type:'object',additionalProperties:false,required:['subject'],properties:{subject:{type:'string',enum:['visible','not_visible','uncertain']}}};
