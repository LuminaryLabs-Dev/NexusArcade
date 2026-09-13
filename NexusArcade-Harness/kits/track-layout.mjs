// Shared geometry contract used by collision, checkpoints and presentation.
export function trackPoint(track,t){
 const a=t*Math.PI*2,r=1+track.wave*Math.cos(track.lobes*a);
 return {x:Math.cos(a)*track.radiusX*r,z:Math.sin(a)*track.radiusZ*r};
}
export function trackFrame(track,t){
 const p=trackPoint(track,t),a=trackPoint(track,t-.0001),b=trackPoint(track,t+.0001),dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz);
 return {...p,nx:dz/l,nz:-dx/l,heading:Math.atan2(dx,dz)};
}
export function trackSegments(track,count=192){return Array.from({length:count+1},(_,i)=>trackFrame(track,i/count));}
export function distanceToTrack(points,p){
 let best=Infinity;
 for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));best=Math.min(best,Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz));}
 return best;
}

// Includes the rendered tires, lamps and spoiler; dimensions are metres.
export const rallyVehicle=Object.freeze({width:1.9,length:2.4});
export function shortcutFrame(track,shortcut,t){
 const a=trackFrame(track,shortcut.from),b=trackFrame(track,shortcut.to),arm=Math.hypot(b.x-a.x,b.z-a.z)*shortcut.curve;
 const p={x:a.x+Math.sin(a.heading)*arm,z:a.z+Math.cos(a.heading)*arm},q={x:b.x-Math.sin(b.heading)*arm,z:b.z-Math.cos(b.heading)*arm},u=1-t;
 const x=u*u*u*a.x+3*u*u*t*p.x+3*u*t*t*q.x+t*t*t*b.x,z=u*u*u*a.z+3*u*u*t*p.z+3*u*t*t*q.z+t*t*t*b.z;
 const dx=3*u*u*(p.x-a.x)+6*u*t*(q.x-p.x)+3*t*t*(b.x-q.x),dz=3*u*u*(p.z-a.z)+6*u*t*(q.z-p.z)+3*t*t*(b.z-q.z),length=Math.hypot(dx,dz);
 return {x,z,nx:dz/length,nz:-dx/length,heading:Math.atan2(dx,dz)};
}
export function trackRoads(track,shortcut){
 const roads=[{id:'circuit',width:track.width,points:trackSegments(track)}];
 if(shortcut&&shortcut.enabled!==false){
  roads.push({id:'shortcut',width:shortcut.width,points:Array.from({length:65},(_,i)=>shortcutFrame(track,shortcut,i/64))});
 }
 return roads;
}
export function trackGates(track,shortcut){
 return Array.from({length:16},(_,i)=>(i+1)/16).filter(t=>!shortcut||t<=shortcut.from||t>=shortcut.to).map((t,i)=>({id:'g'+i,t,...trackFrame(track,t)}));
}
const roadCache=new WeakMap();
export function roadContains(roads,p,inset=0){
 let segments=roadCache.get(roads);
 if(!segments){segments=roads.flatMap(r=>r.points.slice(1).map((b,i)=>{const a=r.points[i],dx=b.x-a.x,dz=b.z-a.z;return {a,dx,dz,length2:dx*dx+dz*dz,radius:r.width/2,minX:Math.min(a.x,b.x),maxX:Math.max(a.x,b.x),minZ:Math.min(a.z,b.z),maxZ:Math.max(a.z,b.z)};}));roadCache.set(roads,segments);}
 for(const s of segments){const radius=s.radius-inset;if(radius<0||p.x<s.minX-radius||p.x>s.maxX+radius||p.z<s.minZ-radius||p.z>s.maxZ+radius)continue;const t=Math.max(0,Math.min(1,((p.x-s.a.x)*s.dx+(p.z-s.a.z)*s.dz)/s.length2)),dx=p.x-s.a.x-t*s.dx,dz=p.z-s.a.z-t*s.dz;if(dx*dx+dz*dz<=radius*radius+1e-9)return true;}
 return false;
}
export function vehicleSupported(roads,p,heading,vehicle=rallyVehicle,clearance=0){
 const sin=Math.sin(heading),cos=Math.cos(heading),w=vehicle.width/2,l=vehicle.length/2;
 const supports=(x,z)=>roadContains(roads,{x:p.x+x*cos+z*sin,z:p.z-x*sin+z*cos},clearance);
 if(!supports(0,0))return false;
 // At most 5cm between a body edge and a tested point; no center-only collision.
 for(const side of [-1,1]){for(let i=0,n=Math.ceil(vehicle.width/.1);i<=n;i++)if(!supports(-w+2*w*i/n,side*l))return false;for(let i=0,n=Math.ceil(vehicle.length/.1);i<=n;i++)if(!supports(side*w,-l+2*l*i/n))return false;}
 return true;
}
export function vehicleSweepSupported(roads,from,to,fromHeading,toHeading,vehicle=rallyVehicle){
 const turn=toHeading-fromHeading,travel=Math.hypot(to.x-from.x,to.z-from.z)+Math.abs(turn)*Math.hypot(vehicle.width,vehicle.length)/2,steps=Math.max(1,Math.ceil(travel/.05));
 for(let i=1;i<=steps;i++){const t=i/steps;if(!vehicleSupported(roads,{x:from.x+(to.x-from.x)*t,z:from.z+(to.z-from.z)*t},fromHeading+turn*t,vehicle))return false;}
 return true;
}

// Validation routes are navigation targets, never runtime movement or state edits.
export function rallyRoute(track,shortcut,useShortcut=false){
 const times=Array.from({length:65},(_,i)=>i/64).filter(t=>!useShortcut||!shortcut||t<=shortcut.from||t>=shortcut.to);
 const points=times.map(t=>({t,...trackFrame(track,t)}));
 if(useShortcut&&shortcut)for(let i=1;i<16;i++)points.push({t:shortcut.from+(shortcut.to-shortcut.from)*i/16,...shortcutFrame(track,shortcut,i/16)});
 return points.sort((a,b)=>a.t-b.t);
}
