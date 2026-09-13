// Shared geometry for flow stations, routing and their Three.js presentation.
export function flowNodes(layout) {
  return ['selector','direct','efficient'].map((key,i)=>({id:'v'+i,...layout[key],target:0,rotation:i===0?3:1}));
}
export function flowWorld(layout) {
  const stations=flowNodes(layout).map(n=>({id:n.id,x:n.x,z:n.z,width:2.8,depth:2.8,height:1.2}));
  const tanks=['source','target','waste'].map(id=>({id,...layout[id],width:3,depth:2.8,height:id==='source'?2.5:5}));
  return {version:1,halfExtent:14.2,actorRadius:.4,solids:[...stations,...tanks]};
}
export function flowPaths(layout) {
  const {source,selector,direct,efficient,target,waste}=layout;
  return [
    {id:'source',state:'router',port:'intake',points:[source,selector]},
    {id:'direct',state:'direct',port:'rate',points:[selector,{x:direct.x,z:selector.z},direct,{x:target.x,z:direct.z},target]},
    {id:'efficient',state:'efficient',port:'rate',points:[selector,{x:efficient.x,z:selector.z},efficient,{x:efficient.x,z:-7},{x:target.x,z:-7},target]},
    {id:'waste-direct',state:'direct',port:'loss',points:[direct,{x:-11,z:direct.z},{x:-11,z:-12},{x:waste.x,z:-12},waste]},
    {id:'waste-efficient',state:'efficient',port:'loss',points:[efficient,{x:11,z:efficient.z},{x:11,z:waste.z},waste]}
  ];
}
