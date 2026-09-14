import {validateSceneRuntime} from './scene-runtime.mjs';

export const themes={
 lagoon:{sky:0xb5d6d3,ground:0x526766,wall:0xb1c7b7,primary:0x55eee0,accent:0xffc174,danger:0xf47562},
 solar:{sky:0xbedbe5,ground:0x94795c,wall:0xe2c395,primary:0x4ce3e8,accent:0xffd264,danger:0xff6351},
 violet:{sky:0x302d4b,ground:0x424257,wall:0x7b7296,primary:0xa2eeed,accent:0xe1a5ff,danger:0xff836d},
 glacier:{sky:0xc9e5ed,ground:0x66838d,wall:0xbfd9df,primary:0x4cfae1,accent:0xffb569,danger:0xfa7568},
 coral:{sky:0xd9c9bd,ground:0x77695f,wall:0xc2ae91,primary:0x75e8c7,accent:0xffa283,danger:0xfd615f}
};
export const cameras={overhead:{movement:'walk',fov:48,heightPerExtent:2.8,backPerExtent:.85},forward:{movement:'walk',fov:65,height:2.6,back:0},chase:{movement:'steering',fov:48,height:6,back:9}};
export const presenters={valve:{body:[1.8,1.8,1.8]},flowSource:{body:[1.4,1.5,1.4]},flowRouter:{body:[.8,.4,.8]},flowLink:{},flowStore:{body:[2,3,2]},reservoir:{body:[2,3,2]},delivery:{},checkpoints:{}};
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const label=x=>typeof x==='string'&&x.trim().length>0&&x.length<=32&&!/[\x00-\x1f]/.test(x);

// Physical prefab dimensions produce both the collision solids and visible body.
// Other domains stay logical; their typed wires still own behavior.
export function compilePresentation(runtime,provenance,p){
 validateSceneRuntime(runtime);
 if(!exact(p,['version','theme','camera','instances','hud'])||p.version!==1||typeof p.theme!=='string'||typeof p.camera!=='string'||!Object.hasOwn(themes,p.theme)||!Object.hasOwn(cameras,p.camera)||cameras[p.camera].movement!==runtime.movement.adapter||!Array.isArray(p.instances)||p.instances.length>128||!Array.isArray(p.hud)||!p.hud.length||p.hud.length>4||new Set(p.hud).size!==p.hud.length)throw Error('Invalid scene presentation');
 const graph=runtime.domainGraph,seen=new Set(),nodes=p.instances.map(x=>{
  const n=graph.instances.find(n=>n.id===x?.id),source=provenance.find(s=>s.id===x?.id);
  if(!exact(x,['id','label','tone'])||!n||!source||!Object.hasOwn(presenters,n.capability)||seen.has(x.id)||!label(x.label)||!['primary','accent','danger'].includes(x.tone))throw Error('Unsupported or duplicate presenter');seen.add(x.id);
  const position=n.capability==='valve'?{x:n.settings.position.x,y:0,z:n.settings.position.z}:{x:source.transform.x,y:0,z:source.transform.z};
  return {...x,capability:n.capability,position,body:presenters[n.capability].body?[...presenters[n.capability].body]:null};
 });
 for(const n of graph.instances)if(Object.hasOwn(presenters,n.capability)&&!seen.has(n.id))throw Error('Missing presenter '+n.id);
 for(const id of p.hud){const n=nodes.find(n=>n.id===id);if(!n||!['flowStore','reservoir','delivery','checkpoints'].includes(n.capability))throw Error('Invalid progress readout');}
 const out=structuredClone(runtime);
 for(const n of nodes.filter(n=>n.body)){
  if(out.collision.adapter!=='world')throw Error('Physical domain presenters require world collision');
  const id='view-'+n.id;if(out.collision.world.solids.some(s=>s.id===id))throw Error('Reserved presenter solid ID');const [width,height,depth]=n.body;
  const solid={id,x:n.position.x,z:n.position.z,width,height,depth};
  if(Math.abs(solid.x)+width/2>out.collision.world.halfExtent||Math.abs(solid.z)+depth/2>out.collision.world.halfExtent)throw Error('Presenter outside world');
  if(out.collision.world.solids.some(s=>Math.abs(s.x-solid.x)<(s.width+width)/2&&Math.abs(s.z-solid.z)<(s.depth+depth)/2))throw Error('Overlapping physical presenters/world solids');out.collision.world.solids.push(solid);
 }
 validateSceneRuntime(out);
 return {runtime:out,presentation:{version:1,theme:p.theme,camera:p.camera,nodes,hud:[...p.hud]}};
}
