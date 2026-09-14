import {compileCatalogScene} from './catalog-compiler.mjs';
import {compilePresentation} from './kits/scene-presentation.mjs';
import {createSceneEngine} from './kits/scene-runtime.mjs';
import {assertAllowedText} from './text-policy.mjs';
import {resolveSceneLayers} from './scene-layers.mjs';
import {digest} from './factory.mjs';
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
// Gameplay identity ignores editorial labels and instance names so relabeling
// or palette changes cannot evade duplicate detection.
export function structuralSceneSignature(composition,validationPlan=composition?.validationPlan){
 const r=composition?.runtime,g=r?.domainGraph;if(!r||!g)throw Error('Missing runtime for structural signature');
 const nodes=[...g.instances].map((n,index)=>({index,capability:n.capability,settings:n.settings})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
 const ordinal=new Map();for(const [i,n] of nodes.entries())ordinal.set(g.instances[n.index].id,{capability:n.capability,ordinal:i});
 const wires=g.wires.map(w=>({from:ordinal.get(w.from),out:w.out,to:ordinal.get(w.to),in:w.in,delay:w.delay})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
 const solids=(r.collision?.world?.solids??[]).map(s=>({x:s.x,z:s.z,width:s.width,height:s.height,depth:s.depth,openWhen:s.openWhen?{port:s.openWhen.port,target:ordinal.get(s.openWhen.instance)}:null})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
 const routes=[validationPlan?.steps??[],...(validationPlan?.alternatives??[]).map(x=>x.steps)].map(steps=>steps.map(s=>s.action==='move'?{action:s.action,x:s.x,z:s.z}:s.action==='interact'?{action:s.action,count:s.count}:{action:s.action,seconds:s.seconds}));
 return digest({movement:r.movement,graph:{nodes:nodes.map(({capability,settings})=>({capability,settings})),wires},solids,routes,camera:composition.presentation?.camera});
}
export function validateScenePlan(plan,runtime){
 if(!exact(plan,['version','steps',...(Object.hasOwn(plan??{},'alternatives')?['alternatives']:[])])||plan.version!==1||!Array.isArray(plan.steps)||!plan.steps.length||plan.steps.length>128)throw Error('Invalid scene validation plan');
 if(plan.alternatives!==undefined){
  if(!Array.isArray(plan.alternatives)||!plan.alternatives.length||plan.alternatives.length>4)throw Error('Invalid alternative routes');
  const ids=new Set(),paths=new Set([digest(plan.steps)]);
  for(const route of plan.alternatives){
   if(!exact(route,['id','steps'])||typeof route.id!=='string'||!/^[a-z][a-z0-9-]{0,39}$/.test(route.id)||route.id==='primary'||ids.has(route.id)||paths.has(digest(route.steps)))throw Error('Duplicate or invalid alternative route');
   ids.add(route.id);paths.add(digest(route.steps));validateScenePlan({version:1,steps:route.steps},runtime);
  }
 }
 let seconds=0;for(const s of plan.steps){
  if(s?.action==='move'){if(!exact(s,['action','x','z'])||runtime.movement.adapter!=='walk'||![s.x,s.z].every(n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=50))throw Error('Invalid planned movement');}
  else if(s?.action==='interact'){if(!exact(s,['action','count'])||!Number.isInteger(s.count)||s.count<1||s.count>4)throw Error('Invalid planned interaction');seconds+=s.count*.1;}
  else if(s?.action==='wait'){if(!exact(s,['action','seconds'])||typeof s.seconds!=='number'||!Number.isFinite(s.seconds)||s.seconds<.05||s.seconds>runtime.session.durationSeconds)throw Error('Invalid planned wait');seconds+=s.seconds;}
  else throw Error('Unknown validation action');
 }
 if(seconds>runtime.session.durationSeconds)throw Error('Validation plan exceeds session');return plan;
}
export function compilePlayableScene(catalog,profile,{title='Connected Systems',theme}={}){
 assertAllowedText({profile,title,theme});
 if(!exact(profile,['version','scene','presentation','replayReason','validationPlan',...(Object.hasOwn(profile??{},'layers')?['layers']:[]),...(Object.hasOwn(profile??{},'guidance')?['guidance']:[])])||profile.version!==1||typeof profile.replayReason!=='string'||profile.replayReason.trim().length<10||profile.replayReason.length>300||typeof title!=='string'||title.trim().length<3||title.length>80||theme!==undefined&&(typeof theme!=='string'||!theme))throw Error('Invalid playable scene profile');
 if(profile.guidance!==undefined&&(!Array.isArray(profile.guidance)||profile.guidance.length>16||profile.guidance.some(t=>typeof t!=='string'||!t.trim()||t.length>200)))throw Error('Invalid player guidance');
 const compiled=compileCatalogScene(catalog,profile.scene),view=compilePresentation(compiled.runtime,compiled.provenance,{...profile.presentation,...(theme?{theme}:{})});
 const layers=resolveSceneLayers(catalog,profile.layers??[]);Object.assign(view.presentation,layers.settings);
 createSceneEngine(view.runtime);validateScenePlan(profile.validationPlan,view.runtime);
 const steering=view.runtime.movement.adapter==='steering',controls=(steering?'W / ↑ accelerate · S / ↓ brake and reverse · A/D steer':'WASD / arrows move · E / Space interact')+' · Esc pause · R restart · F fullscreen';
 const composition={version:4,title,goal:compiled.specificIntent,...(profile.guidance?.length?{instructions:[compiled.specificIntent,...profile.guidance].join(' ')}:{}),controls,concepts:profile.scene.behavior.decisions.filter(d=>d.pointId==='concepts').map(d=>d.optionId.split('.').at(-1)),replay:{reason:profile.replayReason,recordKey:digest({runtime:view.runtime,presentation:view.presentation})},...view};
 return {status:'SCENE_ASSEMBLABLE',eligible:false,fullGame:false,composition,validationPlan:structuredClone(profile.validationPlan),compilation:{...compiled,sceneLayers:layers,unresolvedGamePoints:compiled.unresolvedGamePoints.filter(id=>!layers.resolved.some(l=>l.pointId===id)),requiredCapabilities:[...new Set([...compiled.requiredCapabilities,...layers.requiredCapabilities])],requiredRules:[...new Set([...compiled.requiredRules,...layers.requiredRules])]},profileHash:digest(profile),remaining:'Rendered assembly is a development capability. Catalog coverage, independent concept/replay/novelty/presentation/device qualification and factory admission remain required.'};
}
