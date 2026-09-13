import {rallyRoute,trackRoads,roadContains,vehicleSupported} from './kits/track-layout.mjs';
import {routeInWorld,deliveryPlans} from './kits/spatial-world.mjs';
import {chromium} from 'playwright';
import {serveFiles} from './review3d.mjs';
import {digest} from './factory.mjs';
export async function reviewPilot(root,id,{signal}={}){
 const server=await serveFiles(root),report={status:'FAIL',method:'Keyboard-controlled accelerated Chromium software-WebGL pilot playthrough',checks:[],errors:[]};let browser;const check=(name,pass,observed)=>{report.checks.push({name,pass,observed});if(!pass)throw Error(name);};
 try{browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});signal?.throwIfAborted();const abort=()=>browser.close().catch(()=>{});signal?.addEventListener('abort',abort,{once:true});const p=await browser.newPage({viewport:{width:1100,height:780}});p.setDefaultTimeout(15000);p.on('pageerror',e=>report.errors.push(e.message));const origin='http://127.0.0.1:'+server.address().port;await p.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.abort());await p.goto(origin+'/'+id+'/index.html');await p.waitForFunction(()=>!!window.render_game_to_text);const state=()=>p.evaluate(()=>JSON.parse(render_game_to_text())),tick=ms=>p.evaluate(ms=>advanceTime(ms),ms);const input=async(keys,ms=100)=>{signal?.throwIfAborted();for(const k of keys)await p.keyboard.down(k);await tick(ms);for(const k of keys)await p.keyboard.up(k);};await tick(0);check('title', (await state()).mode==='title');await p.click('#start');await tick(0);
 await p.keyboard.press('Escape');const paused=await state();await tick(180000);check('pause remains until explicit resume',(await state()).mode==='pause'&&(await state()).elapsed===paused.elapsed);await p.click('#start');await tick(0);check('explicit resume',(await state()).mode==='play');await p.evaluate(()=>dispatchEvent(new Event('blur')));await tick(1000);check('focus loss pauses',(await state()).mode==='pause');await p.click('#start');await tick(0);
 report.initialRender=await p.evaluate(()=>__renderEvidence());check('Three.js gameplay geometry',report.initialRender.triangles>1000);const start=await state();
 const profile=await p.evaluate(()=>JSON.parse(document.getElementById('composition').textContent));
 const walkRoute=async(x,z)=>{const initial=await state(),route=routeInWorld(profile.spatialWorld,initial.player,{x,z},initial.domainState);for(const point of route.points.slice(1)){let reached=false;for(let i=0;i<700;i++){const s=await state(),dx=point.x-s.player.x,dz=point.z-s.player.z;if(Math.hypot(dx,dz)<.18){reached=true;break;}if(s.mode!=='play')throw Error('Route ended in '+s.mode);await input([Math.abs(dx)>.1?(dx>0?'KeyD':'KeyA'):null,Math.abs(dz)>.1?(dz>0?'KeyS':'KeyW'):null].filter(Boolean),50);}if(!reached)throw Error('World route stalled');}return route.distance;};
 if(['transfer','conduit','rally'].includes(start.kind)){report.initialImage=await p.screenshot();report.initialHash=digest(report.initialImage);}
 if(start.kind==='rally'){
  for(const [key,sign] of [['KeyD',1],['KeyA',-1]]){
   await input(['KeyW'],300);const before=await state(),right=(await p.evaluate(()=>__renderEvidence())).cameraRight;
   await input([key],200);const after=await state(),lateral=(after.player.x-before.player.x)*right.x+(after.player.z-before.player.z)*right.z;
   check(key+' steers toward its side of the player view',lateral*sign>.005,{lateral,cameraRight:right});
   await p.keyboard.press('KeyR');await tick(0);
  }
 }
 const playLoop=async(conservative=false,fault=false)=>{
 if(start.kind==='transfer'){
  await input(['KeyE']);check('empty space cannot pick up',(await state()).carry===null);
  const plans=deliveryPlans(profile),plan=conservative?plans.at(-1):plans[0];let distance=0;
  for(const id of plan.order){const n=start.nodes.find(n=>n.id===id);distance+=await walkRoute(n.x,n.z);await input(['KeyE']);check('single cargo ownership '+n.id,(await state()).carry===n.id);await tick(50);await input(['KeyE']);check('wrong receiver cannot complete '+n.id,!(await state()).completed.includes(n.id));distance+=await walkRoute(n.receiver.x,n.receiver.z);await input(['KeyE']);check('matched receiver '+n.id,(await state()).completed.includes(n.id));
   for(const gate of profile.spatialWorld.solids.filter(b=>b.openWhen?.instance==='unlock-'+n.id)){const observed=await state();check('delivery opens door '+gate.id,observed.domainState[gate.openWhen.instance].active);const a={x:gate.x-3,z:gate.z},b={x:gate.x+3,z:gate.z},closed=routeInWorld(profile.spatialWorld,a,b,start.domainState),opened=routeInWorld(profile.spatialWorld,a,b,observed.domainState);check('door changes available route '+gate.id,opened.distance<closed.distance,{closed:closed.distance,opened:opened.distance});}
   if(!report.image&&Object.entries((await state()).domainState).some(([id,v])=>id.startsWith('unlock-')&&v.active)){report.image=await p.screenshot();report.frame=await state();report.detailImage=await p.screenshot({clip:{x:180,y:180,width:760,height:440}});}
  }
  report.deliveryRuns??=[];report.deliveryRuns.push({order:plan.order,predictedDistance:plan.distance,routeDistance:distance,elapsed:(await state()).elapsed});
 }else if(start.kind==='conduit'){
  const selected=conservative?'efficient':'direct',index=conservative?2:1,n=start.nodes[index],selector=start.nodes[0];
  await tick(1000);check('off selector does not pump',(await state()).domainState.router.pumped===0);
  await walkRoute(n.x,n.z+2.3);while((await state()).rotation[index]!==0){await input(['KeyE']);await tick(50);}check('route valve opens '+selected,(await state()).domainState[n.id].aligned);
  await walkRoute(selector.x,selector.z+2.3);while((await state()).rotation[0]!==Number(conservative)){await input(['KeyE']);await tick(50);}await tick(4000);const flowing=await state();check('selected route carries flow '+selected,flowing.domainState[selected].rate>0&&flowing.domainState[selected==='direct'?'efficient':'direct'].rate===0);check('target and waste accumulate',flowing.fill>0&&flowing.domainState.waste.volume>0);
  const view=await p.evaluate(()=>__renderEvidence());check('world labels have bounded screen size',view.worldLabels.length===6&&view.worldLabels.every(l=>l.width<=260&&l.height<=70),view.worldLabels);if(!report.image){report.image=await p.screenshot();report.frame=flowing;}
  for(let i=0;i<200&&(await state()).mode==='play';i++)await tick(250);
  const result=await state(),d=result.domainState;check('fluid conserved '+selected,Math.abs(d.router.pumped-d.reservoir.volume-d.reservoir.overflow-d.waste.volume-d.waste.overflow)<1e-6);report.flowRuns??=[];report.flowRuns.push({route:selected,elapsed:result.elapsed,target:d.reservoir.volume,waste:d.waste.volume,pumped:d.router.pumped});
 }else{
  await input(['KeyA'],100);check('steering stationary cannot earn checkpoint',(await state()).completed.length===0);
  const route=rallyRoute(profile.track,profile.shortcut,!conservative),roads=trackRoads(profile.track,profile.shortcut),main=[roads[0]];
  let index=1,collisions=0,lastCollision='',offMainTicks=0,distance=0,ticks=0,faultDone=false,faultLeft=0,recovery=0,recoveryOrigin=null;
  for(;ticks<4000;ticks++){
   const s=await state();if(s.mode!=='play')break;let target=route[index];while(index<route.length-1&&(Math.hypot(target.x-s.player.x,target.z-s.player.z)<1.3||Math.hypot(route[index+1].x-s.player.x,route[index+1].z-s.player.z)<Math.hypot(target.x-s.player.x,target.z-s.player.z)))target=route[++index];
   const desired=Math.atan2(target.x-s.player.x,target.z-s.player.z),diff=Math.atan2(Math.sin(desired-s.heading),Math.cos(desired-s.heading)),limit=Math.abs(diff)>.5?5:Math.min(10,profile.handling.maxSpeed*.85);
   if(fault&&!faultDone&&target.t>(profile.shortcut.from+profile.shortcut.to)/2){faultDone=true;faultLeft=4;}
   if(recovery>0&&s.speed<0&&Math.hypot(s.player.x-recoveryOrigin.x,s.player.z-recoveryOrigin.z)>=profile.vehicle.length/4)recovery=0;const recovering=recovery-->0,steering=recovering?0:faultLeft-->0?1:Math.abs(diff)>.04?Math.sign(diff):0;
   await input([steering?(steering>0?'KeyA':'KeyD'):null,recovering||s.speed>limit?'KeyS':'KeyW'].filter(Boolean),50);
   const next=await state(),last=next.events.at(-1);distance+=Math.hypot(next.player.x-s.player.x,next.player.z-s.player.z);
   if(!vehicleSupported(roads,next.player,next.heading,profile.vehicle))throw Error('Vehicle body crossed road edge');
   if(last?.type==='collision'&&JSON.stringify(last)!==lastCollision){collisions++;if(recovery<=0){recovery=22;recoveryOrigin=next.player;}lastCollision=JSON.stringify(last);}
   if(!roadContains(main,next.player)){offMainTicks++;if(!fault&&!conservative&&!report.image){report.image=await p.screenshot();report.frame=next;report.detailImage=await p.screenshot({clip:{x:120,y:440,width:860,height:280}});}}
   if(collisions>300)throw Error('Rally route cannot recover from collision');
  }
  const result=await state();check('full vehicle stays on composed road',result.mode==='won',{route:conservative?'wide':'shortcut',ticks,collisions});
  report.rallyRuns??=[];report.rallyRuns.push({route:conservative?'wide':'shortcut',fault,faultDone,elapsed:result.elapsed,mode:result.mode,distance,offMainTicks,collisions});

 }
 };await playLoop(true);
 const won=await state();check('complete loop',won.mode==='won',won);report.completionSeconds=won.elapsed;report.runs=[{elapsed:won.elapsed,result:won.lastResult}];check('first record saved',won.bestSeconds===won.elapsed);await p.keyboard.press('KeyR');await tick(0);check('record survives restart',(await state()).bestSeconds===won.elapsed);await playLoop();const second=await state();check('second complete loop',second.mode==='won',second);check('record compares equivalent repeated run',second.lastResult.previousBest===won.elapsed&&second.bestSeconds===Math.min(won.elapsed,second.elapsed));if(start.kind==='rally'){check('shortcut improves lap beyond timing noise',won.elapsed-second.elapsed>=.25&&second.elapsed<=won.elapsed*.99,report.rallyRuns);check('shortcut changes driven route',report.rallyRuns[0].offMainTicks===0&&report.rallyRuns[1].offMainTicks>0&&report.rallyRuns[1].distance<report.rallyRuns[0].distance,report.rallyRuns);const labels=(await p.evaluate(()=>__renderEvidence())).worldLabels;check('shortcut label stays bounded and clear of HUD',labels.length===1&&labels.every(l=>l.width<=220.001&&l.height<=55.001&&(!l.visible||l.x>=110&&l.x<=990&&l.y>=90&&l.y<=670)),labels);const body=report.initialRender.vehicleBounds;check('collision footprint matches rendered vehicle',body&&Math.abs(body.width-profile.vehicle.width)<=.02&&Math.abs(body.length-profile.vehicle.length)<=.02,body);}if(start.kind==='conduit')check('route choice trades speed for waste headroom',won.elapsed-second.elapsed>=.25&&second.elapsed<=won.elapsed*.99&&report.flowRuns[1].waste>report.flowRuns[0].waste&&report.flowRuns.every(r=>r.waste<profile.flowProcess.wasteCapacity),report.flowRuns);if(start.kind==='transfer')check('delivery order and shortcuts improve replay',won.elapsed-second.elapsed>=.25&&second.elapsed<=won.elapsed*.99&&report.deliveryRuns[0].order.join()!==report.deliveryRuns[1].order.join(),report.deliveryRuns);report.runs.push({elapsed:second.elapsed,result:second.lastResult});await p.reload();await p.waitForFunction(()=>!!window.render_game_to_text);await tick(0);check('record survives reload',(await state()).bestSeconds===second.bestSeconds);report.render=await p.evaluate(()=>__renderEvidence());check('ending still renders',report.render.triangles>0);await p.keyboard.press('KeyR');await tick(0);if(start.kind==='transfer')check('restart closes shortcut doors',Object.entries((await state()).domainState).filter(([id])=>id.startsWith('unlock-')).every(([,v])=>v.active===false));check('restart clears session',(await state()).completed.length===0&&(await state()).elapsed===0&&(await state()).carry===null);if(start.kind==='conduit'){const n=start.nodes[0];await walkRoute(n.x,n.z+2.3);await input(['KeyE']);await tick(500);check('closed route sends all flow to waste',(await state()).fill===0&&(await state()).domainState.waste.volume>0);await tick(60000);check('waste capacity fails immediately',(await state()).mode==='lost'&&(await state()).domainState['resource-goal'].failed);await p.keyboard.press('KeyR');await tick(0);check('restart clears all stored fluid',(await state()).domainState.router.pumped===0&&(await state()).domainState.waste.volume===0&&(await state()).fill===0);}
 if(start.kind==='conduit'){
  report.flowFaults=[];
  for(const [selected,index] of [['direct',1],['efficient',2]]){
   await p.keyboard.press('KeyR');await tick(0);
   const turn=async(index,rotation)=>{const n=start.nodes[index];await walkRoute(n.x,n.z+2.3);for(let i=0;(await state()).rotation[index]!==rotation;i++){if(i>=4)throw Error('Valve input did not reach requested state');await input(['KeyE'],50);await tick(50);}};
   await turn(index,0);await turn(0,index-1);
   const n=start.nodes[index];await walkRoute(n.x,n.z+2.3);
   await input(['KeyE'],50);await tick(50);await tick(1500);
   for(let i=0;(await state()).mode==='play'&&(await state()).rotation[index]!==0;i++){if(i>=4)throw Error('Valve recovery input stalled');await input(['KeyE'],50);await tick(50);}
   for(let i=0;i<200&&(await state()).mode==='play';i++)await tick(250);
   const result=await state(),d=result.domainState;
   check('same valve mistake '+(index===1?'exhausts short-route capacity':'recovers on long route'),result.mode===(index===1?'lost':'won'),{mode:result.mode,waste:d.waste.volume,target:d.reservoir.volume});
   check('fluid conserved after mistake '+selected,Math.abs(d.router.pumped-d.reservoir.volume-d.reservoir.overflow-d.waste.volume-d.waste.overflow)<1e-6);
   report.flowFaults.push({route:selected,mode:result.mode,elapsed:result.elapsed,target:d.reservoir.volume,waste:d.waste.volume,pumped:d.router.pumped,mistakeSeconds:1.5});
  }
  await p.keyboard.press('KeyR');await tick(0);
 }
 if(start.kind==='rally'){
  for(const wide of [true,false]){await p.keyboard.press('KeyR');await tick(0);await playLoop(wide,true);}
  const [wide,short]=report.rallyRuns.slice(2);check('same steering mistake costs more collisions on narrow route',wide.faultDone&&short.faultDone&&short.collisions>wide.collisions,{wide,short});
  await p.keyboard.press('KeyR');await tick(0);await input(['KeyS'],1000);const reversed=await state();check('brake key can reverse for recovery',reversed.speed<0&&Math.hypot(reversed.player.x-start.player.x,reversed.player.z-start.player.z)>.1);await p.keyboard.press('KeyR');await tick(0);
 }
 await tick(301000);check('idle failure',(await state()).mode==='lost');await p.keyboard.press('KeyR');await tick(0);check('restart after failure',(await state()).mode==='play');check('no browser errors',report.errors.length===0);report.status='PASS';if(report.image)report.screenshotHash=digest(report.image);if(report.detailImage)report.detailHash=digest(report.detailImage);signal?.removeEventListener('abort',abort);
 }catch(e){report.errors.push(e.message);}finally{await browser?.close();await new Promise(r=>server.close(r));}return report;
}
