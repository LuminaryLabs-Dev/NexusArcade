import {digest} from './factory.mjs';
import {rollConceptRoots} from './catalog.mjs';
import {compileSceneRecipe,inspectRecipeChoices} from './scene-recipe.mjs';
import {assertAllowedText} from './text-policy.mjs';
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));

// Root selection precedes compatibility matching. Missing supported fragments
// fail the composition; they never cause a new roll or a silent root swap.
export function compileConceptRecipe(catalog,input){
 assertAllowedText(input);
 if(!exact(input,['version','seed','concepts','base','fragments',...(Object.hasOwn(input??{},'lineage')?['lineage']:[])])||input.version!==1||!exact(input.concepts,['optionIds','count','depth'])||!Array.isArray(input.fragments)||!input.fragments.length||input.fragments.length>64)throw Error('Invalid concept recipe');
 const roll=rollConceptRoots(catalog,{...input.concepts,seed:input.seed}),selected=new Set(roll.decisions.map(d=>d.optionId)),ids=new Set();
 for(const f of input.fragments){
  if(!exact(f,['id','when','choices'])||typeof f.id!=='string'||!/^[a-z][a-z0-9-]{0,39}$/.test(f.id)||ids.has(f.id)||!exact(f.when,['all','none'])||!Array.isArray(f.choices)||!f.choices.length)throw Error('Invalid concept fragment');
  ids.add(f.id);
  for(const list of [f.when.all,f.when.none])if(!Array.isArray(list)||new Set(list).size!==list.length||list.some(id=>!input.concepts.optionIds.includes(id)))throw Error('Unknown or repeated concept match');
  if(f.when.all.some(id=>f.when.none.includes(id)))throw Error('Contradictory concept match');
 }
 inspectRecipeChoices(input.fragments.flatMap(f=>f.choices));
 const base=structuredClone(input.base),behavior=base?.scene?.behavior;
 if(!Array.isArray(behavior?.decisions)||behavior.decisions.some(d=>d.pointId==='concepts')||!Array.isArray(behavior.conceptBranches)||behavior.conceptBranches.length)throw Error('Concept recipe base must not preselect roots or interpretations');
 // No fragment may add a root behind the independent roll's back.
 const check=choices=>{for(const choice of choices)for(const o of choice.options){if(o.add.decisions.some(d=>d.pointId==='concepts'))throw Error('Fragment cannot override independently rolled roots');check(o.children);}};
 for(const f of input.fragments)check(f.choices);
 behavior.decisions.push(...roll.decisions);
 const matched=input.fragments.filter(f=>f.when.all.every(id=>selected.has(id))&&f.when.none.every(id=>!selected.has(id)));
 if(!matched.length)throw Error('No supported fragments for rolled concepts');
 const recipe={version:1,seed:input.seed,base,choices:matched.flatMap(f=>f.choices),...(input.lineage?{lineage:structuredClone(input.lineage)}:{})};
 const compiled=compileSceneRecipe(catalog,recipe);
 return {...compiled,status:'CONCEPT_RECIPE_COMPILED',conceptRecipeHash:digest(input),conceptRoll:roll,matchedFragments:matched.map(f=>f.id),recipe};
}
