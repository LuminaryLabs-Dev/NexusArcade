import {digest} from './factory.mjs';
import {random} from './domains.mjs';
import {domainDefinitions} from './kits/domain-graph.mjs';
import {compilePlayableScene} from './scene-spec.mjs';
import {assertAllowedText} from './text-policy.mjs';
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,39}$/.test(x);
const fields=['decisions','conceptBranches','domainInstances','connections','presenters','steps'];

export function inspectRecipeChoices(choices){
 let total=0;const choiceIds=new Set();
 function inspect(choices,depth){
  if(depth>8&&choices.length)throw Error('Recipe expansion exceeds supported depth');
  for(const choice of choices){
   if(!exact(choice,['id','options'])||!id(choice.id)||choiceIds.has(choice.id)||!Array.isArray(choice.options)||!choice.options.length||choice.options.length>64||++total>128)throw Error('Invalid, duplicate or oversized recipe choice');choiceIds.add(choice.id);const optionIds=new Set();
   for(const option of choice.options){
    if(!exact(option,['id','add','children'])||!id(option.id)||optionIds.has(option.id)||!exact(option.add,[...fields,...(Object.hasOwn(option.add??{},'guidance')?['guidance']:[])])||!fields.every(k=>Array.isArray(option.add[k])&&option.add[k].length<=128)||!Array.isArray(option.children))throw Error('Invalid recipe option');optionIds.add(option.id);
    if(option.add.guidance!==undefined&&(!Array.isArray(option.add.guidance)||option.add.guidance.length>8||option.add.guidance.some(t=>typeof t!=='string'||!t.trim()||t.length>200)))throw Error('Invalid fragment player guidance');
    if(!option.add.domainInstances.length&&!option.add.connections.length&&!option.children.length)throw Error('Recipe option has no behavior contribution');
    for(const n of option.add.domainInstances)if(!exact(n,['id','capabilityId','capabilityVersion','settings','transform','sourceOptionIds'])||!id(n.id)||!Object.hasOwn(domainDefinitions,n.capabilityId)||n.capabilityVersion!==1||!domainDefinitions[n.capabilityId].settings(n.settings))throw Error('Unsupported fragment domain');
    inspect(option.children,depth+1);
   }
  }
 }
 inspect(choices,0);
}

function applyVariant(profile, variant){
 if(variant===undefined)return;
 if(!exact(variant,['id','patches','addSolids'])||!id(variant.id)||!Array.isArray(variant.patches)||variant.patches.length>16||!Array.isArray(variant.addSolids)||variant.addSolids.length>16)throw Error('Invalid recipe variant');
 const allowed=new Set(['/scene/movement/start','/presentation/theme','/presentation/camera','/replayReason']);
 for(const patch of variant.patches){
  if(!exact(patch,['path','value'])||!allowed.has(patch.path))throw Error('Unsupported recipe variant patch');
  const keys=patch.path.split('/').slice(1);let obj=profile;
  for(const key of keys.slice(0,-1)){if(!obj||typeof obj!=='object'||!Object.hasOwn(obj,key))throw Error('Unknown recipe variant path');obj=obj[key];}
  obj[keys.at(-1)]=structuredClone(patch.value);
 }
 const solids=profile.scene?.collision?.world?.solids;
 if(!Array.isArray(solids))throw Error('Recipe variants require world collision');
 const ids=new Set(solids.map(s=>s.id));
 for(const solid of variant.addSolids){
  if(!exact(solid,['id','x','z','width','height','depth'])||!id(solid.id)||ids.has(solid.id)||![solid.x,solid.z,solid.width,solid.height,solid.depth].every(Number.isFinite)||solid.width<=0||solid.height<=0||solid.depth<=0)throw Error('Invalid variant solid');
  ids.add(solid.id);solids.push(structuredClone(solid));
 }
}

// Data-only fragments add to one scene. The existing graph/scene compiler owns
// port types, contribution, spatial support and all admission-independent guards.
export function compileSceneRecipe(catalog,recipe){
 assertAllowedText(recipe);
 if(!exact(recipe,['version','seed','base','choices',...(Object.hasOwn(recipe??{},'variant')?['variant']:[]),...(Object.hasOwn(recipe??{},'lineage')?['lineage']:[])])||recipe.version!==1||!Number.isInteger(recipe.seed)||recipe.seed<0||recipe.seed>4294967295||!Array.isArray(recipe.choices)||!recipe.choices.length)throw Error('Invalid scene recipe');
 if(recipe.lineage!==undefined&&(!exact(recipe.lineage,['sourceIdeas','change'])||!Array.isArray(recipe.lineage.sourceIdeas)||!recipe.lineage.sourceIdeas.length||recipe.lineage.sourceIdeas.length>8||!recipe.lineage.sourceIdeas.every(id)||new Set(recipe.lineage.sourceIdeas).size!==recipe.lineage.sourceIdeas.length||typeof recipe.lineage.change!=='string'||recipe.lineage.change.trim().length<10||recipe.lineage.change.length>300))throw Error('Invalid recipe lineage');
 inspectRecipeChoices(recipe.choices);
 const profile=structuredClone(recipe.base),behavior=profile?.scene?.behavior;
 if(!behavior||!Array.isArray(behavior.decisions)||!Array.isArray(behavior.conceptBranches)||!Array.isArray(behavior.domainInstances)||!Array.isArray(behavior.connections)||!Array.isArray(profile.presentation?.instances)||!Array.isArray(profile.validationPlan?.steps))throw Error('Invalid recipe base');
 behavior.seed=recipe.seed;const rng=random(recipe.seed),trace=[];
 function expand(choices,ancestry){for(const choice of choices){
  const index=Math.floor(rng()*choice.options.length),option=choice.options[index];trace.push({choiceId:choice.id,optionId:option.id,index,ancestry:[...ancestry]});
  for(const d of option.add.decisions){const prior=behavior.decisions.find(x=>x.optionId===d.optionId);if(prior&&digest(prior)!==digest(d))throw Error('Conflicting fragment decision');if(!prior)behavior.decisions.push(structuredClone(d));}
  for(const branch of option.add.conceptBranches)if(!behavior.conceptBranches.includes(branch))behavior.conceptBranches.push(branch);
  behavior.domainInstances.push(...structuredClone(option.add.domainInstances));behavior.connections.push(...structuredClone(option.add.connections));profile.presentation.instances.push(...structuredClone(option.add.presenters));profile.validationPlan.steps.push(...structuredClone(option.add.steps));
  if(option.add.guidance?.length)(profile.guidance??=[]).push(...option.add.guidance);
  expand(option.children,[...ancestry,choice.id+'/'+option.id]);
 }}
 expand(recipe.choices,[]);
 applyVariant(profile,recipe.variant);
 const compiled=compilePlayableScene(catalog,profile);
 return {status:'RECIPE_COMPILED',eligible:false,seed:recipe.seed,recipeHash:digest(recipe),trace,profile,compiled,remaining:'Seeded behavior expansion is not proof of concept causality, replay, novelty, visual quality or factory acceptance.'};
}
