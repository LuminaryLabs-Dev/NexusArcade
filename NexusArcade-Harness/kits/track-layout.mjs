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
