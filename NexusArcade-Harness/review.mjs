import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {hash} from './model.mjs';

export async function reviewGame(file,{signal}={}) {
  const bytes=await readFile(file);const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(bytes);});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
  const result={artifactHash:hash(bytes),method:'Chromium software-rendered keyboard interaction + accelerated simulation (not real-time or human acceptance)',checks:[],errors:[]};
  const check=(name,passed,detail)=>{result.checks.push({name,passed,detail});};
  try {
    browser=await chromium.launch({headless:true,args:['--disable-gpu']});const page=await browser.newPage({viewport:{width:1000,height:840}});page.setDefaultTimeout(8000);
    const abort=()=>browser.close().catch(()=>{});signal?.addEventListener('abort',abort,{once:true});
    const origin='http://127.0.0.1:'+server.address().port;
    await page.route('**/*',route=>{const u=route.request().url();return u.startsWith(origin+'/')||u.startsWith('data:image/')?route.continue():route.abort();});
    page.on('pageerror',e=>result.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text());});
    await page.goto(origin);await page.waitForFunction(()=>typeof window.render_game_to_text==='function');
    const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
    const tick=ms=>page.evaluate(ms=>window.advanceTime(ms),ms);
    const press=async key=>{await page.keyboard.press(key);await tick(0);};
    await tick(0);check('title',(await state()).mode==='title');await page.click('#play');await tick(0);check('play',(await state()).mode==='play');
    const initial=await state();await page.keyboard.down('ArrowRight');await tick(400);await page.keyboard.up('ArrowRight');check('movement',(await state()).player.x>initial.player.x+20);
    await press('Escape');let before=await state();await tick(1000);let after=await state();check('pause clock frozen',Math.abs(after.time-before.time)<.01&&after.pauseLease<before.pauseLease);
    await press('Escape');await press('Escape');check('pause allowance persists',(await state()).pauseLease<120);await tick(120000);check('pause expires',(await state()).mode==='play');
    await press('KeyR');check('restart resets',(await state()).score===0&&(await state()).pauseLease===120);
    const go=async target=>{for(let i=0;i<100;i++){if(signal?.aborted)throw Error('Cancelled');const st=await state();if(st.mode!=='play')return false;const dx=target.x-st.player.x,dy=target.y-st.player.y;if(Math.hypot(dx,dy)<12)return true;const k=Math.abs(dx)>Math.abs(dy)?dx>0?'ArrowRight':'ArrowLeft':dy>0?'ArrowDown':'ArrowUp';await page.keyboard.down(k);await tick(Math.min(160,Math.max(20,Math.max(Math.abs(dx),Math.abs(dy))/220*1000)));await page.keyboard.up(k);}return false;};
    let st=await state();const D=st.domains;
    if(D.collection||D.delivery||D.resources?.component==='refill'){
      await go(st.pickups.find(p=>p.active));await tick(100);st=await state();check('pickup changes state',st.collected>0);
      if(D.delivery){await go(st.depot);st=await state();check('delivery scores',st.delivered>0&&st.cargo===0&&st.score>0);}
    }
    if(D.territory){st=await state();await go(st.sites[0]);await page.keyboard.down('Space');await tick(3500);await page.keyboard.up('Space');check('territory captures',(await state()).captured>0);}
    if(D.resources){await page.keyboard.down('ArrowRight');await tick(800);await page.keyboard.up('ArrowRight');st=await state();check('resource drains',st.drained>0);if(D.resources.component==='rest')await tick(5000);else {st=await state();const p=st.pickups.find(p=>p.active);if(p)await go(p);}check('resource restores',(await state()).restored>0);}
    if(D.progression){for(let i=0;i<4&&(await state()).level<2;i++){st=await state();if(st.mode!=='play')break;await press('KeyU');await go({x:i%2?80:720,y:i%2?420:80});await tick(1000);}st=await state();
      // Earn remaining passive milestones while moving around the perimeter, not standing in enemies.
      for(let i=0;i<25&&st.level<2&&st.mode==='play';i++){await go([{x:720,y:80},{x:720,y:420},{x:80,y:420},{x:80,y:80}][i%4]);await press('KeyU');st=await state();}
      check('two upgrade layers',st.level===2&&st.upgrades===2);await page.keyboard.down('ArrowLeft');await tick(400);await page.keyboard.up('ArrowLeft');check('upgrade active',(await state()).upgradeUsed>0);}
    // Preserve an actual gameplay frame and its state before destructive scenarios.
    st=await state();if(st.mode!=='play'){await press('KeyR');await page.keyboard.down('ArrowRight');await tick(600);await page.keyboard.up('ArrowRight');}
    await tick(0);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const sample=()=>page.evaluate(()=>{window.advanceTime(0);const c=document.querySelector('canvas'),p=c.getContext('2d').getImageData(0,0,c.width,c.height).data;const colors=new Set();for(let i=0;i<p.length;i+=16)colors.add(p[i]+','+p[i+1]+','+p[i+2]);return colors.size;});
    const samples=[await sample()];
    // One recorded zero-time redraw tolerates transient headless capture loss, never a blank result.
    if(samples[0]<=8){await page.evaluate(()=>new Promise(r=>requestAnimationFrame(r)));samples.push(await sample());}
    check('canvas painted',samples.at(-1)>8,{colorSamples:samples});
    result.frameState=await state();result.image=await page.screenshot({type:'png'});result.screenshotHash=hash(result.image);
    if(D.pursuit){await press('KeyR');st=await state();
      // Orbit enemies move off their spawn coordinates immediately; intercept their actual path.
      await go(D.pursuit.component==='orbit'?{x:640,y:250}:st.enemies[0]);
      for(let i=0;i<20&&(await state()).hits===0;i++)await tick(1000);
      check('enemy contact damages',(await state()).hits>0&&(await state()).health<100);}
    await press('KeyR');await tick(301000);st=await state();check('end state',st.mode==='end');check('bounded timing',st.time<=300.02&&st.wall<=420.02);
    if(!D.pursuit)check('full active duration',Math.abs(st.time-300)<.02);
    const ended=st.player;await page.keyboard.down('ArrowRight');await tick(1000);await page.keyboard.up('ArrowRight');check('end input stopped',dist(ended,(await state()).player)<.01);
    await page.click('#exit');await tick(0);check('exit to title',(await state()).mode==='title');
    check('no browser errors',result.errors.length===0);
    signal?.removeEventListener('abort',abort);
  }catch(e){result.errors.push(e.message);check('review completed',false,e.message);}
  finally{await browser?.close();server.closeAllConnections?.();await new Promise(r=>server.close(r));}
  result.status=result.checks.length&&result.checks.every(c=>c.passed)&&!result.errors.length?'PASS':'FAIL';return result;
}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
