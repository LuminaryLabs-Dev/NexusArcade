// Independent roots. Depth expands information, never rolls compatible pairs.
export const domains = [
  {id:'collection', purpose:'Gather scattered objects for score', children:[
    {id:'scattered', purpose:'Freely choose pickup order', components:['scatter']},
    {id:'route', purpose:'Follow a visible trail', components:['trail']}
  ], settings:{count:[5,12]}, needs:'reachable pickups', effect:'collect increases score; with delivery it fills cargo'},
  {id:'pursuit', purpose:'Avoid opponents that threaten health', children:[
    {id:'tracking', purpose:'Opponents approach the player', components:['chase']},
    {id:'circling', purpose:'Opponents move around the arena', components:['orbit']}
  ], settings:{count:[1,3]}, needs:'player movement and health', effect:'contact reduces health with a recovery interval'},
  {id:'delivery', purpose:'Transport cargo to destinations', children:[
    {id:'single', purpose:'Return to one destination', components:['depot']},
    {id:'alternating', purpose:'Alternate destinations', components:['relay']}
  ], settings:{reward:[3,6]}, needs:'cargo source and visible destination; a source is provided even without collection', effect:'pick up cargo then enter marked destination to score'},
  {id:'territory', purpose:'Secure marked locations', children:[
    {id:'presence', purpose:'Stay inside locations', components:['hold']},
    {id:'interaction', purpose:'Activate while inside locations', components:['activate']}
  ], settings:{seconds:[1,3]}, needs:'reachable sites and a progress indicator', effect:'occupation or Space increases capture progress and rewards completion'},
  {id:'resources', purpose:'Manage a replenishable movement reserve', children:[
    {id:'recovery', purpose:'Recover reserve while stationary', components:['rest']},
    {id:'supply', purpose:'Recover reserve through pickups', components:['refill']}
  ], settings:{drain:[1,3]}, needs:'visible meter; empty reserve slows movement but never locks play', effect:'movement consumes energy; stationary or pickups restore it'},
  {id:'progression', purpose:'Earn upgrades through play', children:[
    {id:'mobility', purpose:'Upgrade movement', components:['speed']},
    {id:'endurance', purpose:'Upgrade health and pickup reach', components:['shield']}
  ], settings:{threshold:[2,5]}, needs:'score; passive milestones supplied when no scoring domain is rolled', effect:'score unlocks two visible upgrade layers; U claims the next layer. Shield adds 20 health and 5 pickup reach per layer'}
];
export function random(seed) { let n=seed>>>0; return ()=>{n=(n+0x6D2B79F5)|0; let t=Math.imul(n^n>>>15,1|n); t^=t+Math.imul(t^t>>>7,61|t); return ((t^t>>>14)>>>0)/4294967296;}; }
export function roll(seed,depth=1) {
  if(!Number.isSafeInteger(seed)||seed<0||seed>4294967295||![1,2,3].includes(depth)) throw Error('Invalid seed or depth');
  const rng=random(seed), pool=[...domains];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]];}
  return {seed,depth,domains:pool.slice(0,3).map(d=>({id:d.id,purpose:d.purpose,needs:d.needs,effect:d.effect,
    default:d.children[0].components[0], ...(depth>=2?{children:d.children}:{}),...(depth>=3?{settings:d.settings}:{} )}))};
}
export const object = properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const str=(maxLength=100)=>({type:'string',minLength:1,maxLength,pattern:'^[^`{}<>]*$'});
export function planSchema(rolled){return object({premise:str(180),roles:object(Object.fromEntries(rolled.domains.map(d=>[d.id,str(140)])))});}
export function recipeSchema(rolled){return object({title:str(45),goal:str(150),playerName:str(24),itemName:str(24),threatName:str(24),
  palette:{type:'string',enum:['ocean','citrus','orchid','ember','forest']},
  layout:{type:'string',enum:['open','islands','lanes']},
  speed:{type:'integer',minimum:150,maximum:220},
  domains:object(Object.fromEntries(rolled.domains.map(r=>{const d=domains.find(d=>d.id===r.id);const key=Object.keys(d.settings)[0];const range=d.settings[key];return [r.id,object({role:str(100),component:{type:'string',enum:rolled.depth===1?[r.default]:d.children.flatMap(c=>c.components)},value:{type:'integer',minimum:rolled.depth===3?range[0]:Math.round((range[0]+range[1])/2),maximum:rolled.depth===3?range[1]:Math.round((range[0]+range[1])/2)}})];}))) });}
export const reviewSchema=object({verdict:{type:'string',enum:['PASS','FAIL']},observation:str(250)});
export function validateRecipe(recipe,rolled){validate(recipe,recipeSchema(rolled));const d=recipe.domains,g=recipe.goal.toLowerCase();
  if(!d.delivery&&/deliver|destination|shipment|transport|depot/.test(g))throw Error('Goal promises delivery without delivery domain');
  if(!d.collection&&!d.delivery&&d.resources?.component!=='refill'&&/collect|pickup|gather/.test(g))throw Error('Goal promises pickups without a pickup source');
  if(/shoot|weapon|attack|combat|kill|unlock.*level/.test(g))throw Error('Goal promises unsupported combat or new levels');
  return recipe;
}
export function validate(value,schema,at='root') {
  if(schema.type==='object') {if(!value||typeof value!=='object'||Array.isArray(value))throw Error(at+': expected object');for(const k of schema.required)if(!(k in value))throw Error(at+'.'+k+': missing');for(const k of Object.keys(value)){if(!(k in schema.properties))throw Error(at+'.'+k+': unknown');validate(value[k],schema.properties[k],at+'.'+k);}}
  else if(schema.type==='array'){if(!Array.isArray(value)||value.length>schema.maxItems)throw Error(at+': array limit');value.forEach((v,i)=>validate(v,schema.items,at+'.'+i));}
  else if(schema.type==='string'){if(typeof value!=='string'||(schema.minLength&&value.length<schema.minLength)||(schema.maxLength&&value.length>schema.maxLength)||(schema.pattern&&!new RegExp(schema.pattern).test(value)))throw Error(at+': invalid text');if(/\b(short string|another string|third string|placeholder|lorem ipsum|under \d+ characters|within \d+|string.*chars|type.*string)\b/i.test(value))throw Error(at+': placeholder instead of an actual game decision');}
  else if(schema.type==='integer'){if(!Number.isInteger(value)||value<schema.minimum||value>schema.maximum)throw Error(at+': integer range');}
  if(schema.enum&&!schema.enum.includes(value))throw Error(at+': unknown choice'); return value;
}
