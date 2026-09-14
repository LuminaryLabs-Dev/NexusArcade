import {digest,validateShape} from './factory.mjs';
import {random} from './domains.mjs';
import {assertAllowedText} from './text-policy.mjs';

// Each binding consumes every selected parameter. Unsupported options stay gaps;
// sampling this table is development configuration, never catalog eligibility.
const bindings={
 'materials.luminous-standard':{pointId:'materials',target:'surface',parameters:['roughness','metalness']},
 'lighting.directional-fog':{pointId:'lighting',target:'illumination',parameters:['exposure','fogDensity']}
};
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
export function resolveSceneLayers(catalog,layers){
 assertAllowedText(layers);
 if(!Array.isArray(layers)||layers.length>Object.keys(bindings).length)throw Error('Invalid scene layer list');
 const seen=new Set(),resolved=[],settings={};
 for(const layer of layers){
  if(!exact(layer,['pointId','optionId','parameters']))throw Error('Invalid scene layer');
  const b=bindings[layer.optionId],point=catalog.decisionPoints.find(p=>p.id===layer.pointId),option=point?.options.find(o=>o.id===layer.optionId);
  if(!b||!option||b.pointId!==layer.pointId||seen.has(layer.pointId))throw Error('Unsupported or duplicate scene layer');
  if(option.children?.some(c=>c.kind!=='capability_leaf')||Object.keys(option.parameters).sort().join()!==[...b.parameters].sort().join())throw Error('Scene binding no longer covers catalog contract');
  validateShape(layer.parameters,{type:'object',properties:option.parameters,additionalProperties:false});
  const parameters={};for(const key of b.parameters){parameters[key]=Object.hasOwn(layer.parameters,key)?layer.parameters[key]:option.parameters[key].default;validateShape(parameters[key],option.parameters[key]);}
  seen.add(layer.pointId);settings[b.target]={...parameters};resolved.push({...layer,parameters});
 }
 const chosen=new Set(resolved.map(x=>x.optionId));
 for(const layer of resolved){const option=catalog.decisionPoints.find(p=>p.id===layer.pointId).options.find(o=>o.id===layer.optionId);if(option.conflicts.some(id=>chosen.has(id)))throw Error('Conflicting scene layers');}
 for(const rule of catalog.compatibilityRules)if(chosen.has(rule.ifSelected)&&(rule.predicate||(rule.requiresSelected??[]).some(id=>!chosen.has(id))))throw Error('Unresolved scene layer compatibility');
 return {settings,resolved,bindingHash:digest(bindings),catalogHash:digest(catalog),eligible:false,requiredCapabilities:[...new Set(resolved.flatMap(l=>catalog.decisionPoints.find(p=>p.id===l.pointId).options.find(o=>o.id===l.optionId).requires))],requiredRules:[...new Set(resolved.flatMap(l=>catalog.decisionPoints.find(p=>p.id===l.pointId).options.find(o=>o.id===l.optionId).validationRefs))]};
}

// Requested option/value lists are subsets of the authoritative catalog bounds.
// Save the seed and lists with the profile to reproduce this expansion exactly.
export function rollSceneLayers(catalog,seed,lists){
 if(!Number.isInteger(seed)||seed<0||seed>4294967295||!Array.isArray(lists)||!lists.length||lists.length>Object.keys(bindings).length)throw Error('Invalid seeded layer request');
 const rng=random(seed),points=new Set(),resolved=lists.map(list=>{
  if(!exact(list,['pointId','options'])||points.has(list.pointId)||!Array.isArray(list.options)||!list.options.length)throw Error('Invalid layer choice list');points.add(list.pointId);
  const ids=new Set();for(const choice of list.options){
   if(!exact(choice,['optionId','parameters'])||ids.has(choice.optionId))throw Error('Invalid or duplicate layer choice');ids.add(choice.optionId);
   const b=bindings[choice.optionId];if(!b||!exact(choice.parameters,b.parameters))throw Error('Missing or unsupported parameter choices');
   for(const [key,values]of Object.entries(choice.parameters)){
    if(!Array.isArray(values)||!values.length||values.length>64||new Set(values.map(digest)).size!==values.length)throw Error('Invalid parameter value list');
    for(const value of values)resolveSceneLayers(catalog,[{pointId:list.pointId,optionId:choice.optionId,parameters:{[key]:value}}]);
   }
  }
  const choice=list.options[Math.floor(rng()*list.options.length)],parameters=Object.fromEntries(Object.entries(choice.parameters).map(([key,values])=>[key,values[Math.floor(rng()*values.length)]]));
  return {pointId:list.pointId,optionId:choice.optionId,parameters};
 });
 const result=resolveSceneLayers(catalog,resolved);
 return {...result,seed,listsHash:digest(lists),lists:structuredClone(lists),remaining:'Supported presentation parameters only. This roll does not establish gameplay variety, visual novelty, readability or admission.'};
}
