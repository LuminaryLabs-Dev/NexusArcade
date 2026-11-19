import {readFileSync} from 'node:fs';
import {randomInt} from 'node:crypto';
import {random} from './domains.mjs';
import {digest} from './factory.mjs';
import {assertAllowedText} from './text-policy.mjs';

export const rollLists=JSON.parse(readFileSync(new URL('./game-roll-lists.json',import.meta.url),'utf8'));
const rootDimensions=[['genre',1],['gameForm',1],['concepts',3],['goal',1],['space',1],['action',1],['pressure',1],['progression',1],['replay',1],['presentation',1]];
const defaultLinks=['action_consequence','space_action','pressure_tradeoff','progression_escalation','replay_choice','feedback_state','concept_integration'];
const categoryAnchor={genre:'gameForm',gameForm:'goal',concepts:'action',goal:'action',space:'action',action:'goal',pressure:'action',progression:'goal',replay:'action',presentation:'space'};
const kindAnchor={action_consequence:'goal',space_action:'space',pressure_tradeoff:'action',progression_escalation:'goal',replay_choice:'action',feedback_state:'presentation',concept_integration:'action',engine_capability:'action'};
const maxNodes=96,maxGaps=80;
let defaultListIntegrity=null;
const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&keys.every(k=>Object.hasOwn(value,k));
const seedNumber=(seed,stream)=>Number.parseInt(digest({version:1,seed,stream}).slice(0,8),16)>>>0;
const stableId=(prefix,value)=>prefix+'-'+digest(value).slice(0,16);
const allGapKinds=()=>[...new Set([...rollLists.requiredGapKinds,'engine_capability'])];
const optionOf=(node)=>rollLists.lists[node.list]?.find(x=>x.id===node.optionId);
const rootCategories=new Set(rootDimensions.map(([category])=>category));

export function validateRollLists(data=rollLists){
 if(data.version!==1||!data.lists||!data.gapLists||!Array.isArray(data.requiredGapKinds))throw Error('Invalid game roll-list document');
 const gapKinds=new Set([...data.requiredGapKinds,'engine_capability']);
 for(const [name,items] of Object.entries(data.lists)){
  if(!Array.isArray(items)||!items.length)throw Error('Empty roll list '+name);
  const ids=new Set();for(const item of items){if(!item||typeof item.id!=='string'||!/^[a-z][a-z0-9-]{0,63}$/.test(item.id)||ids.has(item.id)||typeof item.text!=='string'||!item.text.trim())throw Error('Invalid option in '+name);ids.add(item.id);assertAllowedText(item);
   for(const field of ['provides','requires','fills','opens'])if(item[field]!==undefined&&(!Array.isArray(item[field])||new Set(item[field]).size!==item[field].length||item[field].some(x=>typeof x!=='string'||!x)))throw Error('Invalid '+field+' metadata in '+item.id);
   for(const kind of item.requires??[])if(!gapKinds.has(kind))throw Error('Unknown gap requirement '+kind+' in '+item.id);
   for(const kind of item.fills??[])if(!gapKinds.has(kind))throw Error('Unknown gap fill '+kind+' in '+item.id);
   for(const kind of item.opens??[])if(!gapKinds.has(kind))throw Error('Unknown opened gap '+kind+' in '+item.id);
  }
 }
 for(const kind of gapKinds)if(!Array.isArray(data.lists[data.gapLists[kind]]))throw Error('No list for gap '+kind);
 const capabilities=new Set(data.lists.capabilityPatterns.map(x=>x.capabilityId));
 for(const item of [...data.lists.genre,...data.lists.gameForm])if(item.requiredCapability&&!capabilities.has(item.requiredCapability))throw Error('Missing capability pattern '+item.requiredCapability);
 if(!data.runtimeCoverage||!data.capabilityForOption)throw Error('Missing runtime coverage map');
 for(const family of ['conduit','rally'])for(const [category,ids] of Object.entries(data.runtimeCoverage[family]))if(!Array.isArray(ids)||ids.some(id=>!data.lists[category]?.some(option=>option.id===id)))throw Error('Invalid runtime coverage '+family+'/'+category);
 if(!Array.isArray(data.pairRules)||!data.pairRules.length)throw Error('Missing pair rules');
 const pairIds=new Set();for(const rule of data.pairRules){if(!rule||typeof rule.id!=='string'||pairIds.has(rule.id)||!rootCategories.has(rule.from)||!rootCategories.has(rule.to)||!allGapKindsFor(data).includes(rule.kind))throw Error('Invalid pair rule');pairIds.add(rule.id);}
 return {listHash:digest(data),lists:Object.keys(data.lists).length,rootDimensions:rootDimensions.length};
}

function allGapKindsFor(data){return [...new Set([...data.requiredGapKinds,'engine_capability'])];}

export function rollWholeGameScaffold(seed,data=rollLists){
 const integrity=data===rollLists?(defaultListIntegrity??=validateRollLists(data)):validateRollLists(data);
 if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Invalid scaffold seed');
 const nodes=[],rolls=[];
 for(const [category,count] of rootDimensions){
  const list=data.lists[category],selectionSeed=seedNumber(seed,'initial:'+category),rng=random(selectionSeed),pool=[...list],selected=[];
  for(let index=0;index<count;index++){const at=Math.floor(rng()*pool.length);selected.push(pool.splice(at,1)[0]);}
  for(let index=0;index<selected.length;index++){
   const option=selected[index],id=category==='concepts'?'root-concept-'+(index+1):'root-'+category;
   nodes.push({id,category,list:category,optionId:option.id,text:option.text,depth:0,parentGapId:null,locked:true,selectionSeed,...(option.runtimeFamily!==undefined?{runtimeFamily:option.runtimeFamily}:{}),...(option.requiredCapability?{requiredCapability:option.requiredCapability}:{})});
   rolls.push({kind:'initial',category,nodeId:id,selectionSeed,optionId:option.id});
  }
 }
 const rootNodeIds=nodes.map(n=>n.id),rootHash=digest(nodes.map(({id,category,optionId,text,selectionSeed})=>({id,category,optionId,text,selectionSeed})));
 const scaffold={version:1,seed,listHash:integrity.listHash,rootNodeIds,rootHash,nodes,edges:[],gaps:[],rolls,capabilityRequests:[],profile:null,traversal:null,integration:null};
 seedRequiredGaps(scaffold,data);seedRuntimeGaps(scaffold,data);refreshPairProfile(scaffold,data);
 return scaffold;
}

function nodeFor(scaffold,category){return scaffold.nodes.find(n=>n.category===category);}
function nodesFor(scaffold,category){return scaffold.nodes.filter(n=>n.depth===0&&n.category===category);}

export function buildPairProfile(scaffold,data=rollLists){
 const pairs=[];
 for(const rule of data.pairRules){
  const fromNodes=nodesFor(scaffold,rule.from),toNodes=nodesFor(scaffold,rule.to);
  for(const from of fromNodes)for(const to of toNodes){
   const related=scaffold.gaps.filter(g=>g.kind===rule.kind&&((g.fromNodeId===from.id&&g.toNodeId===to.id)||(g.fromNodeId===to.id&&g.toNodeId===from.id)));
   const status=related.some(g=>g.status==='BLOCKED')?'blocked':related.some(g=>g.status==='FILLED')?'matched':related.some(g=>g.status==='OPEN')?'gap':'unresolved';
   pairs.push({id:stableId('pair',{rule:rule.id,from:from.id,to:to.id}),ruleId:rule.id,fromNodeId:from.id,toNodeId:to.id,kind:rule.kind,status,gapIds:related.map(g=>g.id)});
  }
 }
 return {version:1,rules:data.pairRules.map(({id,from,to,kind})=>({id,from,to,kind})),pairs,summary:pairs.reduce((m,p)=>(m[p.status]=(m[p.status]??0)+1,m),{})};
}
function refreshPairProfile(scaffold,data=rollLists){scaffold.profile=buildPairProfile(scaffold,data);return scaffold.profile;}
function addGap(scaffold,{kind,fromNodeId,toNodeId,rationale,requiredCapabilityId='',requiredOptionId='',parentGapId=null,depth=1}){
 if(!allGapKinds().includes(kind)||!scaffold.nodes.some(n=>n.id===fromNodeId)||!scaffold.nodes.some(n=>n.id===toNodeId)||fromNodeId===toNodeId)throw Error('Invalid scaffold gap endpoints');
 const from=scaffold.nodes.find(n=>n.id===fromNodeId),to=scaffold.nodes.find(n=>n.id===toNodeId),deepest=from.depth>=to.depth?from:to;
 depth=Math.max(from.depth,to.depth)+1;parentGapId??=deepest.depth>0?deepest.parentGapId:null;
 assertAllowedText(rationale);
 const key={kind,fromNodeId,toNodeId,requiredCapabilityId,requiredOptionId},id=stableId('gap',key);
 if(scaffold.gaps.some(g=>g.id===id))return false;
 if(scaffold.gaps.length>=maxGaps)throw Error('Scaffold gap capacity reached');
 scaffold.gaps.push({id,...key,rationale:String(rationale).slice(0,180),parentGapId,depth,status:'OPEN'});return true;
}

function seedRequiredGaps(scaffold,data){
 const goal=nodeFor(scaffold,'goal'),space=nodeFor(scaffold,'space'),action=nodeFor(scaffold,'action'),pressure=nodeFor(scaffold,'pressure'),progression=nodeFor(scaffold,'progression'),replay=nodeFor(scaffold,'replay'),presentation=nodeFor(scaffold,'presentation'),form=nodeFor(scaffold,'gameForm');
 const initial=[
  ...scaffold.nodes.filter(n=>n.category==='concepts').map(n=>({kind:'concept_integration',fromNodeId:n.id,toNodeId:action.id,rationale:'Show how this independent concept changes a player action.'})),
  {kind:'concept_integration',fromNodeId:nodeFor(scaffold,'genre').id,toNodeId:form.id,rationale:'Connect the rolled genre to the chosen game form.'},
  {kind:'action_consequence',fromNodeId:action.id,toNodeId:goal.id,rationale:'Connect the player action to measurable objective progress.'},
  {kind:'space_action',fromNodeId:action.id,toNodeId:space.id,rationale:'Make the selected space shape where or how the action works.'},
  {kind:'pressure_tradeoff',fromNodeId:pressure.id,toNodeId:action.id,rationale:'Make pressure change the cost or timing of an action.'},
  {kind:'progression_escalation',fromNodeId:progression.id,toNodeId:goal.id,rationale:'Make progress change a later objective or decision.'},
  {kind:'replay_choice',fromNodeId:replay.id,toNodeId:action.id,rationale:'Give a later run a different useful choice.'},
  {kind:'feedback_state',fromNodeId:presentation.id,toNodeId:space.id,rationale:'Make presentation reveal a real spatial or gameplay state.'}
 ];
 for(const g of initial)addGap(scaffold,g);
 for(const node of scaffold.nodes){const option=optionOf(node);for(const kind of option.requires??[]){let target=nodeFor(scaffold,kindAnchor[kind]??categoryAnchor[node.category]??'action');if(target?.id===node.id)target=nodeFor(scaffold,categoryAnchor[node.category]??'action');if(target)addGap(scaffold,{kind,fromNodeId:node.id,toNodeId:target.id,rationale:'Declared dependency of '+node.optionId+'.',requiredCapabilityId:kind==='engine_capability'?(option.requiredCapability??''):''});}}
}

function seedRuntimeGaps(scaffold,data){
 const form=nodeFor(scaffold,'gameForm'),family=form.runtimeFamily,coverage=data.runtimeCoverage[family];
 for(const node of scaffold.nodes){
  if(node.category==='concepts')continue;
  const option=optionOf(node),target=nodeFor(scaffold,categoryAnchor[node.category]??'action')??form;
  const supported=coverage?.[node.category]?.includes(node.optionId);
  if(option.requiredCapability||!supported){
   const requiredCapabilityId=option.requiredCapability??data.capabilityForOption[option.id]??'generic-domain-extension';
   const requiredOptionId=option.id;
   const reason=!family?'The rolled game form has no validated runtime family.':option.requiredCapability?'The selected domain declares an unimplemented engine requirement.':'The selected root is outside the verified '+node.category+' coverage for the '+family+' runtime.';
   if(target.id!==node.id)addGap(scaffold,{kind:'engine_capability',fromNodeId:node.id,toNodeId:target.id,rationale:reason,requiredCapabilityId,requiredOptionId});
  }
 }
}

function gapProposalSchema(scaffold,candidateNodeIds){
 const available=Math.max(0,maxGaps-scaffold.gaps.length),normalLimit=Math.min(12,Math.ceil(available/2)),capabilityLimit=Math.min(8,available-normalLimit),nodes=[...new Set(candidateNodeIds)].filter(id=>scaffold.nodes.some(n=>n.id===id)),capabilityIds=[...new Set([...rollLists.lists.capabilityPatterns.map(x=>x.capabilityId),...Object.values(rollLists.capabilityForOption),'generic-domain-extension'])],relationshipKinds=allGapKinds().filter(kind=>kind!=='engine_capability'),endpoints={fromNodeId:{type:'string',enum:nodes},toNodeId:{type:'string',enum:nodes},reason:{type:'string',minLength:8,maxLength:120}};
 return {type:'object',additionalProperties:false,required:['gaps','capabilityGaps'],properties:{gaps:{type:'array',maxItems:normalLimit,items:{type:'object',additionalProperties:false,required:['fromNodeId','toNodeId','kind','reason'],properties:{...endpoints,kind:{type:'string',enum:relationshipKinds}}}},capabilityGaps:{type:'array',maxItems:capabilityLimit,items:{type:'object',additionalProperties:false,required:['fromNodeId','toNodeId','capabilityId','reason'],properties:{...endpoints,capabilityId:{type:'string',enum:capabilityIds}}}}}};
}

export function applyScaffoldGapReview(scaffold,proposal,candidateNodeIds){
 const allowed=new Set([...scaffold.rootNodeIds,...candidateNodeIds]),known=new Set(scaffold.nodes.map(n=>n.id));let count=0,rejected=0;
 for(const item of proposal.gaps){if(!allowed.has(item.fromNodeId)||!allowed.has(item.toNodeId)||!known.has(item.fromNodeId)||!known.has(item.toNodeId)||item.fromNodeId===item.toNodeId){rejected++;continue;}count+=Number(addGap(scaffold,{kind:item.kind,fromNodeId:item.fromNodeId,toNodeId:item.toNodeId,rationale:item.reason}));}
 for(const item of proposal.capabilityGaps){if(!allowed.has(item.fromNodeId)||!allowed.has(item.toNodeId)||!known.has(item.fromNodeId)||!known.has(item.toNodeId)||item.fromNodeId===item.toNodeId){rejected++;continue;}const source=scaffold.nodes.find(n=>n.id===item.fromNodeId),sourceOption=optionOf(source);if(!sourceOption){rejected++;continue;}count+=Number(addGap(scaffold,{kind:'engine_capability',fromNodeId:item.fromNodeId,toNodeId:item.toNodeId,rationale:item.reason,requiredCapabilityId:item.capabilityId,requiredOptionId:sourceOption.id}));}
 scaffold.lastGapReview={focusedNodeIds:[...new Set(candidateNodeIds)],proposed:proposal.gaps.length+proposal.capabilityGaps.length,added:count,rejected};refreshPairProfile(scaffold);return count;
}

export function rollTargetedGap(scaffold,gapId,data=rollLists){
 const gap=scaffold.gaps.find(g=>g.id===gapId);if(!gap||gap.status!=='OPEN')throw Error('Scaffold gap is not open');
 if(scaffold.nodes.length>=maxNodes)throw Error('Scaffold node capacity reached');
 const listName=data.gapLists[gap.kind],all=data.lists[listName].filter(option=>option.fills?.includes(gap.kind));
 let candidates=all;if(gap.kind==='engine_capability'&&gap.requiredCapabilityId){const exact=all.filter(option=>option.capabilityId===gap.requiredCapabilityId);candidates=exact.length?exact:all.filter(option=>option.capabilityId==='generic-domain-extension');}
 if(!candidates.length){gap.status='UNRESOLVED';gap.resolution='No targeted roll option matches this gap.';return null;}
 const selectionSeed=seedNumber(scaffold.seed,'gap:'+gap.id),option=candidates[Math.floor(random(selectionSeed)()*candidates.length)],nodeId=stableId('roll',gap.id);
 const node={id:nodeId,category:'gapFill',list:listName,optionId:option.id,text:option.text,depth:gap.depth,parentGapId:gap.id,locked:true,selectionSeed,fills:[...option.fills],opens:[...(option.opens??[])],...(option.capabilityId?{capabilityId:option.capabilityId}:{})};
 scaffold.nodes.push(node);scaffold.rolls.push({kind:'targeted-gap',gapId:gap.id,depth:gap.depth,selectionSeed,list:listName,optionId:option.id});
 gap.rollNodeId=nodeId;gap.status=gap.kind==='engine_capability'?'BLOCKED':'FILLED';
 if(gap.kind==='engine_capability'){
 const request={gapId:gap.id,sourceNodeId:gap.fromNodeId,targetNodeId:gap.toNodeId,sourceOptionId:gap.requiredOptionId||optionOf(scaffold.nodes.find(n=>n.id===gap.fromNodeId))?.id||null,requiredCapabilityId:gap.requiredCapabilityId||'unspecified',patternId:option.id,status:'UNIMPLEMENTED'};
  scaffold.capabilityRequests.push(request);gap.resolution='Pattern recorded; engine capability has no validated implementation.';
 }else{
  scaffold.edges.push({fromNodeId:gap.fromNodeId,viaNodeId:nodeId,toNodeId:gap.toNodeId,kind:gap.kind,gapId:gap.id});
 }
 refreshPairProfile(scaffold);return node;
}

function rootsForPrompt(scaffold){return scaffold.nodes.filter(n=>n.depth===0).map(n=>{const option=optionOf(n);return {id:n.id,category:n.category,selection:n.optionId,text:n.text,provides:option?.provides??[],requires:option?.requires??[],runtimeFamily:n.runtimeFamily??null,requiredCapabilityId:n.requiredCapability??null};});}
function rootAuditContext(scaffold,rootId,{compact=false}={}){
 const roots=rootsForPrompt(scaffold),root=roots.find(n=>n.id===rootId),relatedEdges=scaffold.edges.filter(e=>e.fromNodeId===rootId||e.toNodeId===rootId),viaIds=new Set(relatedEdges.map(e=>e.viaNodeId)),relatedGaps=scaffold.gaps.filter(g=>g.fromNodeId===rootId||g.toNodeId===rootId||viaIds.has(g.fromNodeId)||viaIds.has(g.toNodeId));
 const nodeIds=new Set([rootId,...relatedEdges.flatMap(e=>[e.fromNodeId,e.viaNodeId,e.toNodeId]),...relatedGaps.flatMap(g=>[g.fromNodeId,g.toNodeId])]);
 return {root,otherRoots:roots.filter(n=>n.id!==rootId).map(n=>({id:n.id,category:n.category,selection:n.selection,...(compact?{}:{text:n.text})})),connectedNodes:scaffold.nodes.filter(n=>nodeIds.has(n.id)&&n.id!==rootId).map(n=>{const option=optionOf(n);return {id:n.id,category:n.category,option:n.optionId,...(compact?{}:{text:n.text,provides:option?.provides??[]}),fills:option?.fills??[],opens:option?.opens??[]};}),connections:relatedEdges.map(e=>({from:e.fromNodeId,via:e.viaNodeId,to:e.toNodeId,kind:e.kind})),gaps:relatedGaps.map(g=>({id:g.id,kind:g.kind,from:g.fromNodeId,to:g.toNodeId,status:g.status,...(compact?{}:{reason:g.rationale}),requiredCapabilityId:g.requiredCapabilityId||null}))};
}
function gapReviewEndpoints(scaffold,frontier){
 const ids=[...scaffold.rootNodeIds],add=id=>{if(id&&!ids.includes(id))ids.push(id);};
 for(const id of frontier){const node=scaffold.nodes.find(n=>n.id===id);if(!node||node.depth===0)continue;const parent=scaffold.gaps.find(g=>g.id===node.parentGapId);add(parent?.fromNodeId);add(parent?.toNodeId);}
 return ids;
}

function gapAuditContext(scaffold,frontier,candidateNodeIds,compact=false){
 const roots=rootsForPrompt(scaffold),frontierSet=new Set(frontier),edgeRelevant=e=>frontierSet.has(e.fromNodeId)||frontierSet.has(e.viaNodeId)||frontierSet.has(e.toNodeId)||(scaffold.rootNodeIds.includes(e.fromNodeId)&&scaffold.rootNodeIds.includes(e.toNodeId)),rootsForAudit=roots.map(root=>({id:root.id,category:root.category,selection:root.selection,text:root.text.slice(0,compact?65:100),interpretation:(scaffold.traversal[root.id]?.interpretation??'').slice(0,compact?55:95),playerEffect:(scaffold.traversal[root.id]?.playerEffect??'').slice(0,compact?55:95)})),focusNodes=frontier.filter(id=>!scaffold.rootNodeIds.includes(id)).map(id=>{const node=scaffold.nodes.find(n=>n.id===id),option=optionOf(node);return {id,optionId:node.optionId,meaning:(option?.text??node.text).slice(0,compact?45:75),depth:node.depth,fills:option?.fills??[],opens:option?.opens??[]};});
 const contextNodes=candidateNodeIds.filter(id=>!scaffold.rootNodeIds.includes(id)&&!frontierSet.has(id)).map(id=>{const node=scaffold.nodes.find(n=>n.id===id),option=optionOf(node);return {id,role:'parent-endpoint',optionId:node.optionId,meaning:(option?.text??node.text).slice(0,compact?36:60),depth:node.depth};});
 return {roots:rootsForAudit,focusNodes,contextNodes,knownGapTuples:scaffold.gaps.map(g=>[g.kind,g.fromNodeId,g.toNodeId,g.status[0],g.requiredCapabilityId||'']),connectedRelationships:scaffold.edges.filter(edgeRelevant).map(e=>[e.kind,e.fromNodeId,optionOf(scaffold.nodes.find(n=>n.id===e.viaNodeId))?.id??'',e.toNodeId]),runtimeFamily:nodeFor(scaffold,'gameForm').runtimeFamily??null};
}

function integrationGraph(scaffold,compact=false){
 const components=scaffold.nodes.flatMap((node,index)=>node.depth===0?[]:[[index,node.optionId,(optionOf(node)?.text??'').slice(0,compact?36:64)]]);
 return {components,connections:scaffold.edges.map((edge,index)=>[index,edge.kind,scaffold.nodes.findIndex(n=>n.id===edge.fromNodeId),scaffold.nodes.findIndex(n=>n.id===edge.viaNodeId),scaffold.nodes.findIndex(n=>n.id===edge.toNodeId)]),blockedCapabilities:[...new Set(scaffold.capabilityRequests.map(request=>request.requiredCapabilityId))],unresolvedGaps:scaffold.gaps.filter(gap=>gap.status==='UNRESOLVED').map(gap=>[gap.kind,gap.fromNodeId,gap.toNodeId,gap.requiredCapabilityId||''])};
}

function integrationPrompt(scaffold,compact=false){
 const graph=integrationGraph(scaffold,compact),roots=rootsForPrompt(scaffold).map(root=>({id:root.id,index:scaffold.nodes.findIndex(n=>n.id===root.id),category:root.category,selection:root.selection,text:root.text.slice(0,compact?55:85)})),traversal=Object.fromEntries(scaffold.rootNodeIds.map(id=>[id,{interpretation:(scaffold.traversal[id]?.interpretation??'').slice(0,compact?65:95),playerEffect:(scaffold.traversal[id]?.playerEffect??'').slice(0,compact?65:95)}]));
 return 'Compose the locked domains and every rolled relationship into one coherent spatial game. Preserve every root and connection. Connect the player goal, repeatable actions, visible consequences, later decisions, completion, and a reason for another run. Give every connectionUses field a short concrete role for its listed edge. Do not claim an unimplemented capability works. '+JSON.stringify({roots,traversal,pairProfile:scaffold.profile,...graph});
}

function traversalSchema(){return {type:'object',additionalProperties:false,required:['interpretation','playerEffect'],properties:{interpretation:{type:'string',minLength:8,maxLength:140},playerEffect:{type:'string',minLength:8,maxLength:140}}};}

function integrationSchema(scaffold){
 const rootIds=scaffold.rootNodeIds,edgeKeys=scaffold.edges.map((_,index)=>'connection-'+index),domainProperties=Object.fromEntries(rootIds.map(id=>[id,{type:'string',minLength:8,maxLength:80}])),connectionProperties=Object.fromEntries(edgeKeys.map(key=>[key,{type:'string',minLength:3,maxLength:32}]));
 return {type:'object',additionalProperties:false,required:['interpretation','playerGoal','loop','domainContributions','connectionUses'],properties:{
  interpretation:{type:'string',minLength:20,maxLength:240},playerGoal:{type:'string',minLength:12,maxLength:180},
  loop:{type:'object',additionalProperties:false,required:['situation','action','consequence','newDecision','completion','replay'],properties:Object.fromEntries(['situation','action','consequence','newDecision','completion','replay'].map(k=>[k,{type:'string',minLength:10,maxLength:110}]))},
  domainContributions:{type:'object',additionalProperties:false,required:rootIds,properties:domainProperties},
  connectionUses:{type:'object',additionalProperties:false,required:edgeKeys,properties:connectionProperties}
 }};
}

function validateTraversalRoot(scaffold,rootId,result){assertAllowedText(result);scaffold.traversal[rootId]={interpretation:result.interpretation,playerEffect:result.playerEffect};}

function validateIntegration(scaffold,result){
 assertAllowedText(result);
 const uses=result.domainContributions,keys=Object.keys(uses),expectedRoots=scaffold.rootNodeIds;
 if(keys.length!==expectedRoots.length||expectedRoots.some(id=>!Object.hasOwn(uses,id)))throw Error('Integration omitted a locked root');
 const connectionUses=result.connectionUses,expectedKeys=scaffold.edges.map((_,index)=>'connection-'+index),connectionKeys=Object.keys(connectionUses);
 if(connectionKeys.length!==expectedKeys.length||expectedKeys.some(key=>!Object.hasOwn(connectionUses,key)))throw Error('Integration omitted a rolled connection');
 return {...result,domainContributions:expectedRoots.map(nodeId=>({nodeId,contribution:uses[nodeId]})),connectionUses:expectedKeys.map((key,index)=>({gapId:scaffold.edges[index].gapId,integration:connectionUses[key]}))};
}

export async function resolveScaffold(scaffold,models,save=async()=>{}){
 const originalRootHash=digest(scaffold.nodes.filter(n=>scaffold.rootNodeIds.includes(n.id)).map(({id,category,optionId,text,selectionSeed})=>({id,category,optionId,text,selectionSeed})));
 scaffold.traversalStatus='TRAVERSING';
 scaffold.traversal??={};
 for(const rootId of scaffold.rootNodeIds){
  if(scaffold.traversal[rootId]){assertAllowedText(scaffold.traversal[rootId]);continue;}
  const context=rootAuditContext(scaffold,rootId),family=nodeFor(scaffold,'gameForm').runtimeFamily??null;
  const traversalPrompt='Inspect this one locked game domain in context. Read its definition, provided concept tags, dependencies and current connections. Explain what it can mean spatially and what the player could observe. Preserve the root. A relationship is not implementation evidence; the harness checks runtime support. The harness reviews gaps after all roots are traversed. '+JSON.stringify({...context,pairProfile:scaffold.profile,runtimeFamily:family,runtimeCoverage:rollLists.runtimeCoverage[family]?.[context.root.category]??[]});
  const traversal=await models.askValidated('planner','scaffold-traverse',traversalPrompt,traversalSchema(),250);
  validateTraversalRoot(scaffold,rootId,traversal);await save();
 }
 scaffold.traversalStatus='TRAVERSED';await save();
 let frontier=[...new Set([...(scaffold.gapAuditFrontier??[]),...scaffold.rootNodeIds])];
 for(;;){
  const candidateNodeIds=gapReviewEndpoints(scaffold,frontier),context=gapAuditContext(scaffold,frontier,candidateNodeIds),auditPrompt='Review the current focus against all locked roots and known gaps. Add only necessary missing links or engine capabilities, involving a locked root, focused node or its parent endpoints. Preserve the initial direction, do not duplicate known gap tuples, and never claim that a description implements a capability. A targeted roll will address each accepted gap. Return empty arrays when this focus is complete. '+JSON.stringify({focusNodeIds:frontier,...context});
  const audit=await models.askValidated('planner','scaffold-gap-review',auditPrompt+JSON.stringify({pairProfile:scaffold.profile}),gapProposalSchema(scaffold,candidateNodeIds),700);
  const added=applyScaffoldGapReview(scaffold,audit,candidateNodeIds);scaffold.gapAuditPasses=(scaffold.gapAuditPasses??0)+1;await save();
  const open=scaffold.gaps.filter(g=>g.status==='OPEN'),nextFrontier=[];
  for(const gap of open.slice(0,12)){const node=rollTargetedGap(scaffold,gap.id);if(node)nextFrontier.push(node.id);await save();}
  if(nextFrontier.length){frontier=nextFrontier;scaffold.gapAuditFrontier=frontier;await save();continue;}
  const stillOpen=scaffold.gaps.some(g=>g.status==='OPEN');
  if(stillOpen){frontier=[];scaffold.gapAuditFrontier=[];await save();continue;}
  if(added){frontier=[];scaffold.gapAuditFrontier=[];await save();continue;}
  if(scaffold.gaps.some(g=>g.status==='OPEN'))throw Error('Open scaffold gap was not processed');
  break;
 }
 scaffold.gapAuditFrontier=[];scaffold.gapAuditStatus='COMPLETE';await save();
 scaffold.integrationStatus='INTEGRATING';await save();
 const pending=scaffold.gaps.filter(g=>g.status==='OPEN'||g.status==='UNRESOLVED'),schema=integrationSchema(scaffold);let integration=null,correction='';
 for(let attempt=0;attempt<3&&!integration;attempt++){
  const proposed=await models.askValidated('planner','scaffold-integrate',integrationPrompt(scaffold,attempt>0||scaffold.edges.length>40)+(correction?' Return every required domain and connection key. Correct the prior structural error: '+correction:''),schema,1000);
  try{integration=validateIntegration(scaffold,proposed);}catch(error){correction=error.message;if(attempt===2)throw error;}
 }
 scaffold.integration=integration;scaffold.integrationStatus='COMPOSED';
 if(originalRootHash!==digest(scaffold.nodes.filter(n=>scaffold.rootNodeIds.includes(n.id)).map(({id,category,optionId,text,selectionSeed})=>({id,category,optionId,text,selectionSeed}))))throw Error('Locked initial scaffold changed');
 if(scaffold.nodes.length>maxNodes)throw Error('Scaffold node capacity reached');
 if(pending.length)scaffold.integrationStatus='BLOCKED_BY_UNRESOLVED_GAP';if(scaffold.capabilityRequests.length)scaffold.integrationStatus='BLOCKED_BY_ENGINE_CAPABILITY';
 return scaffold;
}

export function scaffoldBuildSelection(scaffold){
 const form=nodeFor(scaffold,'gameForm'),family=form.runtimeFamily;
 if(!family||!['conduit','rally'].includes(family))return {supported:false,family:family??null,reason:'No validated pilot adapter for the rolled game form.'};
 const roots=scaffold.nodes.filter(n=>n.depth===0),unsupportedRoots=roots.filter(n=>n.category!=='concepts'&&!rollLists.runtimeCoverage[family]?.[n.category]?.includes(n.optionId)).map(n=>({category:n.category,optionId:n.optionId,capabilityId:n.requiredCapability??rollLists.capabilityForOption[n.optionId]??'generic-domain-extension'}));
 const unimplemented=scaffold.gaps.filter(g=>g.kind==='engine_capability');
 if(unimplemented.length||unsupportedRoots.length){const reasons=[...new Set([...unimplemented.map(g=>g.requiredCapabilityId||'an engine capability'),...unsupportedRoots.map(r=>r.capabilityId)])];return {supported:false,family,reason:'Scaffold requires unvalidated engine support: '+reasons.join(', ')+'.',unsupportedRoots};}
 const rootOptions=Object.fromEntries([...new Set(roots.map(n=>n.category))].map(category=>{const selected=roots.filter(n=>n.category===category).map(n=>({id:n.optionId,text:n.text}));return [category,selected.length>1?selected:selected[0]];}));
 const ids=Object.fromEntries(Object.entries(rootOptions).map(([category,value])=>[category,Array.isArray(value)?value.map(x=>x.id):value.id]));
 const profileSeed=seedNumber(scaffold.seed,'runtime-profile:'+digest(ids));
 const conceptIds=scaffold.nodes.filter(n=>n.category==='concepts').map(n=>n.optionId),presentation=rootOptions.presentation;
 const paletteByPresentation={'presentation-luminous':'solar','presentation-industrial':'glacier','presentation-minimal':'lagoon','presentation-motion':'coral','presentation-color':'violet','presentation-silhouette':'solar','presentation-layered-depth':'glacier','presentation-scale':'coral'};
 return {supported:true,family,profileSeed,conceptIds,rootSelections:ids,rootOptions,presentationId:presentation.id,palette:paletteByPresentation[presentation.id]??'lagoon'};
}

export function choosePlayableScaffold(requestedSeed=null,{maxAttempts=10000}={}){
 const hasSeed=requestedSeed!==null&&requestedSeed!==undefined;
 if(hasSeed&&(!Number.isInteger(requestedSeed)||requestedSeed<0||requestedSeed>4294967295))throw Error('Invalid challenge or seed');
 for(let attempt=0;attempt<(hasSeed?1:maxAttempts);attempt++){
  const seed=hasSeed?requestedSeed:randomInt(0,4294967296),scaffold=rollWholeGameScaffold(seed),selection=scaffoldBuildSelection(scaffold);
  if(selection.supported)return {seed,scaffold,selection,attempts:attempt+1};
 }
 throw Error('No playable scaffold found during preflight');
}

export function inspectScaffold(scaffold){
 if(scaffold.version!==1||!Number.isInteger(scaffold.seed)||scaffold.seed<0||scaffold.seed>4294967295||!Array.isArray(scaffold.nodes)||!Array.isArray(scaffold.edges)||!Array.isArray(scaffold.gaps)||!Array.isArray(scaffold.rolls)||!Array.isArray(scaffold.capabilityRequests))throw Error('Invalid scaffold record');
 if(scaffold.listHash!==defaultListIntegrity.listHash)throw Error('Scaffold roll-list version changed');
 if(!scaffold.profile||JSON.stringify(scaffold.profile)!==JSON.stringify(buildPairProfile(scaffold)))throw Error('Pair profile is missing or stale');
 const expectedCount=new Map(rootDimensions),roots=scaffold.nodes.filter(n=>n.depth===0);if(roots.length!==scaffold.rootNodeIds.length||roots.length!==rootDimensions.reduce((n,[,count])=>n+count,0)||roots.some(n=>!n.locked||n.parentGapId!==null)||scaffold.rootNodeIds.some((id,index)=>roots[index]?.id!==id))throw Error('Locked root set mismatch');
 const counts=new Map(),seenByCategory=new Map();for(const node of roots){const index=counts.get(node.category)??0,expectedId=node.category==='concepts'?'root-concept-'+(index+1):'root-'+node.category,option=rollLists.lists[node.list]?.find(item=>item.id===node.optionId);if(!expectedCount.has(node.category)||node.list!==node.category||node.id!==expectedId||!option||option.text!==node.text||node.selectionSeed!==seedNumber(scaffold.seed,'initial:'+node.category))throw Error('Invalid or untraceable locked root');counts.set(node.category,index+1);const selected=seenByCategory.get(node.category)??new Set();if(selected.has(node.optionId))throw Error('Repeated option within a root category');selected.add(node.optionId);seenByCategory.set(node.category,selected);}
 for(const [category,count] of rootDimensions)if(counts.get(category)!==count)throw Error('Missing locked root category '+category);
 if(seenByCategory.get('concepts')?.size!==3)throw Error('Repeated abstract concept root');
 const initialRolls=scaffold.rolls.filter(r=>r.kind==='initial');if(initialRolls.length!==roots.length||initialRolls.some(r=>{const node=roots.find(n=>n.id===r.nodeId);return !node||r.category!==node.category||r.optionId!==node.optionId||r.selectionSeed!==node.selectionSeed;}))throw Error('Initial roll lineage mismatch');
 const rootHash=digest(roots.map(({id,category,optionId,text,selectionSeed})=>({id,category,optionId,text,selectionSeed})));if(rootHash!==scaffold.rootHash||rollWholeGameScaffold(scaffold.seed).rootHash!==rootHash)throw Error('Locked root hash or seeded selection mismatch');
 const known=new Set(scaffold.nodes.map(n=>n.id)),gaps=new Map(scaffold.gaps.map(g=>[g.id,g])),targetedRolls=new Map(scaffold.rolls.filter(r=>r.kind==='targeted-gap').map(r=>[r.gapId,r]));if(known.size!==scaffold.nodes.length||gaps.size!==scaffold.gaps.length||targetedRolls.size!==scaffold.rolls.filter(r=>r.kind==='targeted-gap').length||scaffold.nodes.length>maxNodes||scaffold.gaps.length>maxGaps)throw Error('Duplicate or oversized scaffold identity');
 for(const gap of scaffold.gaps){const from=scaffold.nodes.find(n=>n.id===gap.fromNodeId),to=scaffold.nodes.find(n=>n.id===gap.toNodeId),deepest=from&&to?(from.depth>=to.depth?from:to):null,expectedParent=deepest?.depth>0?deepest.parentGapId:null,expectedDepth=from&&to?Math.max(from.depth,to.depth)+1:0;assertAllowedText(gap.rationale);if(!from||!to||from.id===to.id||!allGapKinds().includes(gap.kind)||!['OPEN','FILLED','BLOCKED','UNRESOLVED'].includes(gap.status)||gap.depth!==expectedDepth||gap.parentGapId!==expectedParent||gap.parentGapId&&!gaps.has(gap.parentGapId)||gap.kind==='engine_capability'&&!gap.requiredCapabilityId||gap.kind!=='engine_capability'&&gap.status==='BLOCKED'||gap.kind==='engine_capability'&&gap.status==='FILLED')throw Error('Invalid gap lineage');}
 for(const node of scaffold.nodes.filter(n=>n.depth>0)){const parent=gaps.get(node.parentGapId),roll=targetedRolls.get(node.parentGapId),option=rollLists.lists[node.list]?.find(item=>item.id===node.optionId);if(!node.locked||!parent||parent.rollNodeId!==node.id||!['FILLED','BLOCKED'].includes(parent.status)||!roll||roll.optionId!==node.optionId||roll.selectionSeed!==node.selectionSeed||node.selectionSeed!==seedNumber(scaffold.seed,'gap:'+parent.id)||node.depth!==parent.depth||!option||option.text!==node.text||!option.fills?.includes(parent.kind))throw Error('Invalid targeted-roll lineage');}
 for(const gap of scaffold.gaps){if(gap.rollNodeId&&!known.has(gap.rollNodeId))throw Error('Unknown targeted-roll node');if(['FILLED','BLOCKED'].includes(gap.status)&&!gap.rollNodeId||gap.status==='UNRESOLVED'&&gap.rollNodeId||targetedRolls.has(gap.id)!==!!gap.rollNodeId)throw Error('Targeted-roll status mismatch');}
 const edgeGapIds=new Set();for(const edge of scaffold.edges){const gap=gaps.get(edge.gapId);if(!known.has(edge.fromNodeId)||!known.has(edge.viaNodeId)||!known.has(edge.toNodeId)||!gap||gap.status!=='FILLED'||gap.kind==='engine_capability'||edge.kind!==gap.kind||edge.fromNodeId!==gap.fromNodeId||edge.toNodeId!==gap.toNodeId||edge.viaNodeId!==gap.rollNodeId||edgeGapIds.has(edge.gapId))throw Error('Invalid scaffold connection');edgeGapIds.add(edge.gapId);}if(scaffold.gaps.filter(g=>g.status==='FILLED').length!==edgeGapIds.size)throw Error('Filled gap has no unique connection');
 const capabilityGapIds=new Set(scaffold.capabilityRequests.map(r=>r.gapId));if(capabilityGapIds.size!==scaffold.capabilityRequests.length||scaffold.gaps.filter(g=>g.status==='BLOCKED').length!==capabilityGapIds.size)throw Error('Capability request count mismatch');for(const request of scaffold.capabilityRequests)if(!gaps.has(request.gapId)||gaps.get(request.gapId).status!=='BLOCKED'||request.status!=='UNIMPLEMENTED'||request.sourceNodeId!==gaps.get(request.gapId).fromNodeId||request.targetNodeId!==gaps.get(request.gapId).toNodeId||request.requiredCapabilityId!==gaps.get(request.gapId).requiredCapabilityId)throw Error('Invalid capability request lineage');
 return {roots:roots.length,gaps:scaffold.gaps.length,rolledConnections:scaffold.edges.length,capabilityRequests:scaffold.capabilityRequests.length,rootHash};
}

defaultListIntegrity=validateRollLists();
