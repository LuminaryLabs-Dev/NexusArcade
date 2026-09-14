import {compileCatalogScene} from './catalog-compiler.mjs';
import {compilePresentation} from './kits/scene-presentation.mjs';
import {createSceneEngine} from './kits/scene-runtime.mjs';
import {assertAllowedText} from './text-policy.mjs';
import {digest} from './factory.mjs';
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
export function validateScenePlan(plan,runtime){
 if(!exact(plan,['version','steps'])||plan.version!==1||!Array.isArray(plan.steps)||!plan.steps.length||plan.steps.length>128)throw Error('Invalid scene validation plan');
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
 if(!exact(profile,['version','scene','presentation','replayReason','validationPlan'])||profile.version!==1||typeof profile.replayReason!=='string'||profile.replayReason.trim().length<10||profile.replayReason.length>300||typeof title!=='string'||title.trim().length<3||title.length>80||theme!==undefined&&(typeof theme!=='string'||!theme))throw Error('Invalid playable scene profile');
 const compiled=compileCatalogScene(catalog,profile.scene),view=compilePresentation(compiled.runtime,compiled.provenance,{...profile.presentation,...(theme?{theme}:{})});
 createSceneEngine(view.runtime);validateScenePlan(profile.validationPlan,view.runtime);
 const steering=view.runtime.movement.adapter==='steering',controls=(steering?'W / ↑ accelerate · S / ↓ brake and reverse · A/D steer':'WASD / arrows move · E / Space interact')+' · Esc pause · R restart · F fullscreen';
 const composition={version:4,title,goal:compiled.specificIntent,controls,concepts:profile.scene.behavior.decisions.filter(d=>d.pointId==='concepts').map(d=>d.optionId.split('.').at(-1)),replay:{reason:profile.replayReason,recordKey:digest({runtime:view.runtime,camera:view.presentation.camera})},...view};
 return {status:'SCENE_ASSEMBLABLE',eligible:false,fullGame:false,composition,validationPlan:structuredClone(profile.validationPlan),compilation:compiled,profileHash:digest(profile),remaining:'Rendered assembly is a development capability. Catalog coverage, independent concept/replay/novelty/presentation/device qualification and factory admission remain required.'};
}
