import * as THREE from '../vendor/three/three.module.js';
import {themes,cameras} from './scene-presentation.mjs';
import {solidOpen} from './spatial-world.mjs';

export function createSceneView(canvas,c){
 const runtime=c.runtime,p=c.presentation,theme=themes[p.theme],cameraChoice=cameras[p.camera],byId=new Map(runtime.domainGraph.instances.map(n=>[n.id,n]));
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=p.illumination?.exposure??1;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(cameraChoice.fov,1,.1,300);scene.background=new THREE.Color(theme.sky);scene.fog=p.illumination?new THREE.FogExp2(theme.sky,p.illumination.fogDensity):new THREE.Fog(theme.sky,65,160);
 // A small procedural reflection environment keeps metallic surfaces readable.
 // It is shared presentation code, not a generated game asset or model output.
 let environment;
 if(p.surface){const faces=Array.from({length:6},(_,i)=>{const face=document.createElement('canvas');face.width=face.height=64;const ctx=face.getContext('2d'),gradient=ctx.createLinearGradient(0,0,0,64);gradient.addColorStop(0,i===3?'#899baa':'#eff8ff');gradient.addColorStop(.4,'#b4cbd4');gradient.addColorStop(1,i===2?'#cddfe9':'#506577');ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);return face;});environment=new THREE.CubeTexture(faces);environment.colorSpace=THREE.SRGBColorSpace;environment.needsUpdate=true;scene.environment=environment;}
 scene.add(new THREE.HemisphereLight(0xffffff,0x293443,2));const sun=new THREE.DirectionalLight(0xffe5bf,3);sun.position.set(-20,35,15);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.normalBias=.05;Object.assign(sun.shadow.camera,{left:-50,right:50,top:50,bottom:-50});scene.add(sun);
 const material=(color,glow=0)=>new THREE.MeshStandardMaterial({color,roughness:p.surface?.roughness??.65,metalness:p.surface?.metalness??.15,emissive:color,emissiveIntensity:glow});
 const mats={ground:material(theme.ground),wall:material(theme.wall),primary:material(theme.primary,.35),accent:material(theme.accent,.35),danger:material(theme.danger,.25),dark:material(0x182d36)};
 const mesh=(geometry,mat,x,y,z,parent=scene)=>{const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 const box=(w,h,d,x,y,z,mat=mats.wall,parent)=>mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z,parent);
 const sphere=(r,x,y,z,mat,parent)=>mesh(new THREE.SphereGeometry(r,12,8),mat,x,y,z,parent);
 const updates=[],labels=[],physical=[],entities=new Map(),observations=new Map(),pipes=[];let width=1100,height=780,actorBounds=null;
 function plate(text,x,y,z){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d'),texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:true,sizeAttenuation:false}));sprite.position.set(x,y,z);sprite.center.set(.5,-.25);scene.add(sprite);let last;
  const entry={sprite,x:0,y:0,width:160,height:40,text:'',set(value){if(last===value)return;last=value;entry.text=value;ctx.clearRect(0,0,512,128);ctx.fillStyle='#10212de8';ctx.fillRect(0,0,512,128);ctx.fillStyle='#f3ffff';ctx.font='bold 50px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(value,256,64,490);texture.needsUpdate=true;}};entry.set(text);labels.push(entry);return entry;
 }
 const extent=runtime.collision.adapter==='world'?runtime.collision.world.halfExtent:70;box(extent*2,.5,extent*2,0,-.27,0,mats.ground);
 if(runtime.collision.adapter==='world'){
  for(const x of [-extent-.3,extent+.3])box(.6,1,extent*2+1.2,x,.5,0);for(const z of [-extent-.3,extent+.3])box(extent*2,1,.6,0,.5,z);
  for(const solid of runtime.collision.world.solids.filter(s=>!s.id.startsWith('view-'))){const body=box(solid.width,solid.height,solid.depth,solid.x,solid.height/2,solid.z,solid.openWhen?mats.accent:mats.wall);physical.push({solid,body});}
  for(let x=-extent+2;x<extent;x+=2)box(.025,.015,extent*2-.5,x,0,0,mats.wall);
 }else{
  for(const road of runtime.collision.roads){const vertices=[],triangle=(a,b,c)=>vertices.push(a.x,.025,a.z,b.x,.025,b.z,c.x,.025,c.z),radius=road.width/2;
   for(let i=1;i<road.points.length;i++){const a=road.points[i-1],b=road.points[i],length=Math.hypot(b.x-a.x,b.z-a.z),nx=(b.z-a.z)/length*radius,nz=-(b.x-a.x)/length*radius,al={x:a.x-nx,z:a.z-nz},ar={x:a.x+nx,z:a.z+nz},bl={x:b.x-nx,z:b.z-nz},br={x:b.x+nx,z:b.z+nz};triangle(al,bl,ar);triangle(ar,bl,br);}
   for(const p of road.points)for(let i=0;i<64;i++){const a=i*Math.PI/32,b=(i+1)*Math.PI/32;triangle(p,{x:p.x+Math.cos(b)*radius,z:p.z+Math.sin(b)*radius},{x:p.x+Math.cos(a)*radius,z:p.z+Math.sin(a)*radius});}
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();const mat=mats.dark.clone();mat.side=THREE.DoubleSide;mesh(geometry,mat,0,0,0);
  }
 }
 const actor=new THREE.Group();scene.add(actor);
 if(runtime.movement.adapter==='steering'){const v=runtime.collision.vehicle;box(v.width*.85,.55,v.length*.95,0,.55,0,mats.accent,actor);box(v.width*.65,.5,v.length*.45,0,1,0,mats.dark,actor);for(const x of [-v.width*.4,v.width*.4])for(const z of [-v.length*.32,v.length*.32]){const wheel=mesh(new THREE.CylinderGeometry(.3,.3,v.width*.2,12),mats.dark,x,.3,z,actor);wheel.rotation.z=Math.PI/2;}}
 else mesh(new THREE.CapsuleGeometry(runtime.collision.world.actorRadius,.7,4,12),mats.primary,0,.75,0,actor);
 actor.visible=p.camera!=='forward';
 const builders={
  valve(n,node){const pos=node.position,mat=material(theme[node.tone],.5),wheel=mesh(new THREE.TorusGeometry(.7,.12,10,28),mat,pos.x,1.5,pos.z);wheel.rotation.x=-Math.PI/2;const needle=box(.12,.13,1.2,pos.x,1.65,pos.z,mats.accent),tag=plate(node.label,pos.x,2.65,pos.z),router=runtime.domainGraph.wires.some(w=>w.from===n.id&&w.out==='rotation'&&byId.get(w.to).capability==='flowRouter');
   observations.set(n.id,()=>({rotation:needle.rotation.y,label:tag.text}));
   updates.push(s=>{const d=s.domainState[n.id];needle.rotation.y=d.rotation*Math.PI/2;mat.color.setHex(d.aligned?theme.primary:theme.accent);tag.set(node.label+' '+(router?['A','B','A+B','OFF'][d.rotation]:d.aligned?'OPEN':'CLOSED'));});
  },
  flowStore(n,node){const pos=node.position,fluid=box(1.82,.01,1.82,pos.x,.1,pos.z,material(theme[node.tone],.5));for(const x of [-.965,.965])for(const z of [-.965,.965])box(.07,3,.07,pos.x+x,1.5,pos.z+z,mats.wall);box(2,.12,2,pos.x,.05,pos.z,mats.dark);const tag=plate(node.label,pos.x,3.65,pos.z);
   observations.set(n.id,()=>({fillHeight:fluid.scale.y*.01,label:tag.text}));
   updates.push(s=>{const d=s.domainState[n.id],h=Math.max(.01,d.fill*2.75);fluid.scale.y=h/.01;fluid.position.y=.1+h/2;tag.set(node.label+' '+(n.capability==='reservoir'?Math.round(d.fill*100)+'%':Math.round(d.volume)+'/'+n.settings.capacity+' L'));});
  },
  flowSource(n,node){const pos=node.position;box(1.4,1.3,1.4,pos.x,.65,pos.z,mats.wall);const rotor=mesh(new THREE.TorusGeometry(.5,.1,8,24),mats[node.tone],pos.x,1.4,pos.z);rotor.rotation.x=Math.PI/2;plate(node.label,pos.x,2.2,pos.z);updates.push(s=>{rotor.rotation.z=s.elapsed;});},
  flowRouter(n,node){box(.8,.4,.8,node.position.x,.2,node.position.z,mats[node.tone]);},
  flowLink(n,node){const m=sphere(.24,node.position.x,.25,node.position.z,material(theme[node.tone],.2));updates.push(s=>{m.material.emissiveIntensity=s.domainState[n.id].rate>0?.9:.02;});},
  delivery(n,node){for(const [i,item]of n.settings.nodes.entries()){const body=mesh(new THREE.IcosahedronGeometry(.4,1),mats[node.tone],item.x,.7,item.z),target=box(1.5,.12,1.5,item.receiver.x,.05,item.receiver.z,mats[node.tone]),tag=plate(node.label+' '+(i+1),item.x,1.8,item.z);plate('BAY '+(i+1),item.receiver.x,1.3,item.receiver.z);updates.push(s=>{const d=s.domainState[n.id],carried=d.carry===item.id;body.visible=!d.completed.includes(item.id);body.position.set(carried?s.player.x:item.x,carried?2:.7,carried?s.player.z:item.z);body.rotation.y=s.elapsed;tag.sprite.position.copy(body.position).add(new THREE.Vector3(0,1,0));tag.active=body.visible;target.scale.y=d.completed.includes(item.id)?.25:1;});}},
  checkpoints(n,node){for(const [i,item]of n.settings.nodes.entries()){const ring=mesh(new THREE.TorusGeometry(n.settings.range,.08,8,32),mats[node.tone],item.x,.15,item.z);ring.rotation.x=-Math.PI/2;const beacon=sphere(.25,item.x,1.8,item.z,mats[node.tone]),tag=plate(node.label+' '+(i+1),item.x,2.8,item.z);updates.push(s=>{const count=s.domainState[n.id].completed.length;ring.visible=beacon.visible=i>=count&&i<count+3;tag.active=ring.visible;});}}
 };
 builders.reservoir=builders.flowStore;
 for(const node of p.nodes){const n=byId.get(node.id);entities.set(n.id,node);if(node.body&&n.capability==='valve')box(node.body[0],1.2,node.body[2],node.position.x,.6,node.position.z,mats.wall);builders[n.capability](n,node);}
 // Continuous connections are rendered from the same typed graph and placements.
 for(const w of runtime.domainGraph.wires){const a=entities.get(w.from),b=entities.get(w.to);if(!a||!b||!['rate','direct','efficient','loss'].includes(w.out))continue;
  const start=new THREE.Vector3(a.position.x,.08,a.position.z),end=new THREE.Vector3(b.position.x,.08,b.position.z),delta=end.clone().sub(start),length=delta.length();if(length<.01)continue;const mat=material(w.out==='loss'?theme.danger:theme.primary,.1),line=mesh(new THREE.CylinderGeometry(.07,.07,length,8),mat,0,0,0);line.position.copy(start).add(end).multiplyScalar(.5);line.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());const pulse=sphere(.12,0,.1,0,mat);pipes.push({w,start,end,length,pulse,mat});
 }
 const project=v=>{const p=v.clone().project(camera);return {x:(p.x+1)*width/2,y:(1-p.y)*height/2,z:p.z};};
 function render(s){
  actor.position.set(s.player.x,0,s.player.z);actor.rotation.y=s.heading;
  for(const {solid,body}of physical){const opened=solidOpen(solid,s.domainState);body.scale.y=opened?.025:1;body.position.y=opened?.025:solid.height/2;}
  for(const update of updates)update(s);
  for(const pipe of pipes){const value=byId.get(pipe.w.to).capability==='flowRouter'&&pipe.w.in==='rate'?s.domainState[pipe.w.to].intake:s.domainState[pipe.w.from][pipe.w.out];pipe.pulse.visible=value>0;pipe.mat.emissiveIntensity=value>0?.7:.01;if(value>0)pipe.pulse.position.copy(pipe.start).lerp(pipe.end,(s.elapsed*(1+value*.2)%pipe.length)/pipe.length);}
  const heading=p.camera==='chase'?s.heading:Math.PI;
  if(p.camera==='overhead'){camera.position.set(0,extent*cameraChoice.heightPerExtent,extent*cameraChoice.backPerExtent);camera.lookAt(0,0,0);}
  else{camera.position.set(s.player.x-Math.sin(heading)*cameraChoice.back,cameraChoice.height,s.player.z-Math.cos(heading)*cameraChoice.back);camera.lookAt(s.player.x+Math.sin(heading)*8,1,s.player.z+Math.cos(heading)*8);}
  camera.updateMatrixWorld();actorBounds=null;
  if(actor.visible){const b=new THREE.Box3().setFromObject(actor),corners=[];for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])corners.push(project(new THREE.Vector3(x,y,z)));actorBounds={left:Math.min(...corners.map(p=>p.x))-8,right:Math.max(...corners.map(p=>p.x))+8,top:Math.min(...corners.map(p=>p.y))-8,bottom:Math.max(...corners.map(p=>p.y))+8};}
  const used=[];for(const tag of [...labels].sort((a,b)=>a.sprite.position.distanceTo(actor.position)-b.sprite.position.distanceTo(actor.position))){const p=project(tag.sprite.position);p.y-=tag.height*.75;tag.x=p.x;tag.y=p.y;tag.sprite.scale.set(tag.width*2/(camera.projectionMatrix.elements[0]*width),tag.height*2/(camera.projectionMatrix.elements[5]*height),1);const box={left:p.x-tag.width/2,right:p.x+tag.width/2,top:p.y-tag.height/2,bottom:p.y+tag.height/2},overlap=b=>box.right>b.left&&box.left<b.right&&box.bottom>b.top&&box.top<b.bottom;
   tag.sprite.visible=tag.active!==false&&p.z>=-1&&p.z<=1&&box.left>=8&&box.right<=width-8&&box.top>=88&&box.bottom<=height-90&&!(actorBounds&&overlap(actorBounds))&&!used.some(overlap);if(tag.sprite.visible)used.push(box);
  }
  renderer.render(scene,camera);
 }
 function resize(){width=innerWidth;height=innerHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}
 const evidence=()=>({three:THREE.REVISION,triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls,camera:p.camera,actorScreenBounds:actorBounds,domainViews:Object.fromEntries([...observations].map(([id,read])=>[id,read()])),presenters:p.nodes.map(n=>({id:n.id,capability:n.capability})),worldLabels:labels.map(t=>({text:t.text,x:t.x,y:t.y,width:t.width,height:t.height,visible:t.sprite.visible})),connections:pipes.length,appearance:{roughness:mats.wall.roughness,metalness:mats.wall.metalness,exposure:renderer.toneMappingExposure,fogType:scene.fog.type??(scene.fog.isFogExp2?'FogExp2':'Fog'),fogDensity:scene.fog.density??null}});
 const dispose=()=>{environment?.dispose();scene.traverse(o=>{o.geometry?.dispose();for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){m.map?.dispose();m.dispose();}});renderer.dispose();};
 resize();return {render,resize,evidence,dispose};
}
