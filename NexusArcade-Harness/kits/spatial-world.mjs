// Shared collision and navigation geometry. Renderers consume the same solids.
const finite=(v,lo,hi)=>typeof v==='number'&&Number.isFinite(v)&&v>=lo&&v<=hi;
export function validateWorld(w,graph){
 if(!w||w.version!==1||!finite(w.halfExtent,5,50)||!finite(w.actorRadius,.2,1)||!Array.isArray(w.solids)||w.solids.length>128)throw Error('Invalid spatial world');
 if(Object.keys(w).some(k=>!['version','halfExtent','actorRadius','solids'].includes(k)))throw Error('Unknown world setting');
 const ids=new Set();for(const b of w.solids){if(!/^[a-z][a-z0-9-]*$/.test(b.id)||ids.has(b.id)||Object.keys(b).some(k=>!['id','x','z','width','depth','height','openWhen','label'].includes(k))||!finite(b.x,-w.halfExtent,w.halfExtent)||!finite(b.z,-w.halfExtent,w.halfExtent)||!finite(b.width,.1,20)||!finite(b.depth,.1,20)||!finite(b.height,.1,10))throw Error('Invalid world solid');ids.add(b.id);if(b.label!==undefined&&(!Number.isInteger(b.label)||b.label<1||b.label>64))throw Error('Invalid solid label');if(b.openWhen){const n=graph.instances.find(n=>n.id===b.openWhen.instance);if(!n||n.capability!=='contains'||b.openWhen.port!=='active'||Object.keys(b.openWhen).length!==2)throw Error('Invalid door state binding');}}
 return w;
}
export const solidOpen=(b,states)=>!!b.openWhen&&states[b.openWhen.instance]?.[b.openWhen.port]===true;
export function worldSupports(w,p,states={},margin=0){
 const r=w.actorRadius+margin;if(!Number.isFinite(p.x)||!Number.isFinite(p.z)||Math.abs(p.x)+r>w.halfExtent||Math.abs(p.z)+r>w.halfExtent)return false;
 return w.solids.every(b=>solidOpen(b,states)||Math.hypot(Math.max(0,Math.abs(p.x-b.x)-b.width/2),Math.max(0,Math.abs(p.z-b.z)-b.depth/2))>=r);
}
export function routeInWorld(w,start,goal,states={}){
 const unit=.5,min=-Math.floor((w.halfExtent-w.actorRadius-.2)/unit),max=-min,key=(x,z)=>x+','+z;
 const sx=Math.round(start.x/unit),sz=Math.round(start.z/unit),gx=Math.round(goal.x/unit),gz=Math.round(goal.z/unit);
 const clearSegment=(a,b)=>{const count=Math.max(1,Math.ceil(Math.hypot(a.x-b.x,a.z-b.z)/.1));for(let i=0;i<=count;i++)if(!worldSupports(w,{x:a.x+(b.x-a.x)*i/count,z:a.z+(b.z-a.z)*i/count},states,.2))return false;return true;};
 if(!clearSegment(start,{x:sx*unit,z:sz*unit})||!clearSegment({x:gx*unit,z:gz*unit},goal))throw Error('Route endpoint lacks clearance');
 const first=key(sx,sz),target=key(gx,gz),open=new Set([first]),cost=new Map([[first,0]]),prior=new Map(),positions=new Map([[first,[sx,sz]]]);
 while(open.size){let current,best=Infinity;for(const k of open){const [x,z]=positions.get(k),score=cost.get(k)+Math.abs(x-gx)+Math.abs(z-gz);if(score<best){best=score;current=k;}}open.delete(current);
  if(current===target){const points=[goal];while(current!==first){const [x,z]=positions.get(current);points.push({x:x*unit,z:z*unit});current=prior.get(current);}points.push(start);points.reverse();const simplified=[points[0]];for(let i=1;i<points.length-1;i++){const a=simplified.at(-1),b=points[i],c=points[i+1];if(Math.abs((b.x-a.x)*(c.z-b.z)-(b.z-a.z)*(c.x-b.x))>1e-8)simplified.push(b);}simplified.push(points.at(-1));return {points:simplified,distance:simplified.slice(1).reduce((n,p,i)=>n+Math.hypot(p.x-simplified[i].x,p.z-simplified[i].z),0)};}
  const [x,z]=positions.get(current);for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){const nx=x+dx,nz=z+dz,k=key(nx,nz);if(nx<min||nx>max||nz<min||nz>max||!worldSupports(w,{x:nx*unit,z:nz*unit},states,.2))continue;const next=cost.get(current)+1;if(next>=(cost.get(k)??Infinity))continue;cost.set(k,next);prior.set(k,current);positions.set(k,[nx,nz]);open.add(k);}
 }
 throw Error('No traversable route');
}
export function transferWorld(layout){
 const solids=[];for(const [i,x] of [-5,5].entries()){const z=layout.gateZ[i],ends=[[-5,z-1.5],[z+1.5,5]];ends.forEach(([a,b],j)=>solids.push({id:'rack-'+i+'-'+j,x,z:(a+b)/2,width:4,depth:b-a,height:2.2}));solids.push({id:'door-'+i,x,z,width:4,depth:3,height:2.2,openWhen:{instance:'unlock-'+layout.unlocks[i],port:'active'},label:Number(layout.unlocks[i].slice(1))+1});}
 return {version:1,halfExtent:14.2,actorRadius:.4,solids};
}
// Enumerate the small delivery-order list using geometry, not model guesses.
// These are predicted routes; review must still execute them through real inputs.
export function deliveryPlans(c){
 const permutations=xs=>xs.length?xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>j!==i)).map(rest=>[x,...rest])):[[]];
 if(c.nodes.length>6)throw Error('Delivery planning requires a bounded order set');
 return permutations(c.nodes).map(order=>{let position=c.playerStart,distance=0;const states={};for(const n of order){distance+=routeInWorld(c.spatialWorld,position,n,states).distance;distance+=routeInWorld(c.spatialWorld,n,n.receiver,states).distance;position=n.receiver;for(const d of c.domainGraph.instances)if(d.capability==='contains'&&d.settings.item===n.id)states[d.id]={active:true};}return {order:order.map(n=>n.id),distance};}).sort((a,b)=>a.distance-b.distance||a.order.join().localeCompare(b.order.join()));
}
