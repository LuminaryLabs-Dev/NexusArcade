// Trusted component runtime. Model-authored recipes are data; no eval or model code.
export function mountGame(recipe,seed) {
  const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'), W=800,H=500;
  canvas.width=W;canvas.height=H;
  const D=recipe.domains,keys=new Set(); let s,last=performance.now(),manual=false,audio;
  const palettes={ocean:['#0b2034','#5de4ee','#ffd379'],citrus:['#182720','#c2ed63','#ffb66e'],orchid:['#211b38','#ddbcff','#66edce'],ember:['#301d25','#ffc08a','#95e5ff'],forest:['#162e2b','#9ae7a8','#ffe2a1']};
  const [bg,accent,gold]=palettes[recipe.palette];
  const el=id=>document.getElementById(id),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  let n;const rand=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
  function point(i=0){return recipe.layout==='lanes'?{x:100+(i%6)*120,y:100+Math.floor(rand()*3)*140}:recipe.layout==='islands'?{x:400+Math.cos(i*2.4)*260,y:250+Math.sin(i*2.4)*160}:{x:60+rand()*680,y:60+rand()*380};}
  function sound(freq=440){if(el('sound').checked){audio??=new AudioContext();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=freq;g.gain.setValueAtTime(.04,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);o.start();o.stop(audio.currentTime+.12);}}
  function reset(){n=seed>>>0;s={mode:'title',time:0,wall:0,pauseLease:120,player:{x:400,y:250,r:12},health:100,energy:100,score:0,cargo:0,level:0,invulnerable:0,
    collected:0,delivered:0,captured:0,hits:0,upgrades:0,drained:0,restored:0,upgradeUsed:0,
    pickups:[],enemies:[],sites:[],depot:{x:735,y:250,r:28},nextScore:8};
    const count=D.collection?.value??(D.delivery?6:D.resources?.component==='refill'?5:0);
    for(let i=0;i<count;i++)s.pickups.push({...point(i),r:9,id:i,active:true});
    if(D.collection?.component==='trail')s.pickups.forEach((p,i)=>{p.x=80+(i%7)*100;p.y=100+Math.floor(i/7)*230;});
    for(let i=0;i<(D.pursuit?.value??0);i++)s.enemies.push({x:70+i*200,y:60,r:13,phase:i*2});
    if(D.territory)s.sites=[{x:160,y:360,r:33,progress:0,cooldown:0},{x:640,y:130,r:33,progress:0,cooldown:0}];
    keys.clear();draw();}
  function start(){if(s.mode==='title'){s.mode='play';sound(520);draw();}}
  function pause(){if(s.mode==='play'&&s.pauseLease>0)s.mode='pause';else if(s.mode==='pause')s.mode='play';draw();}
  function upgrade(){if(!D.progression||s.mode!=='play'||s.level>=2||s.score<(s.level+1)*D.progression.value)return;s.level++;s.upgrades++;if(D.progression.component==='shield')s.health=Math.min(140,s.health+20);sound(700);draw();}
  function step(dt){if(s.mode==='title'||s.mode==='end')return;
    s.wall+=dt;if(s.mode==='pause'){s.pauseLease=Math.max(0,s.pauseLease-dt);if(s.pauseLease===0)s.mode='play';if(s.wall>=420)s.mode='end';return;}
    s.time=Math.min(300,s.time+dt);s.invulnerable=Math.max(0,s.invulnerable-dt);
    let dx=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0),dy=(keys.has('ArrowDown')||keys.has('KeyS')?1:0)-(keys.has('ArrowUp')||keys.has('KeyW')?1:0);
    const len=Math.hypot(dx,dy);if(len){const v=recipe.speed*(s.energy>0?1:.55)*(D.progression?.component==='speed'?1+s.level*.2:1);s.player.x=Math.max(18,Math.min(W-18,s.player.x+dx/len*v*dt));s.player.y=Math.max(18,Math.min(H-18,s.player.y+dy/len*v*dt));
      if(D.resources){const cost=Math.min(s.energy,dt*D.resources.value);s.energy-=cost;s.drained+=cost;}}
    else if(D.resources?.component==='rest'){const gain=Math.min(100-s.energy,dt*15);s.energy+=gain;s.restored+=gain;}
    if(s.level>0&&len)s.upgradeUsed+=dt;
    for(const p of s.pickups){if(!p.active)continue;if(dist(s.player,p)<s.player.r+p.r+(D.progression?.component==='shield'?s.level*5:0)){p.active=false;p.returnAt=s.time+5;s.collected++;if(D.delivery)s.cargo++;else s.score++;
      if(D.resources?.component==='refill'){const gain=Math.min(100-s.energy,35);s.energy+=gain;s.restored+=gain;}sound(550);}}
    for(const p of s.pickups)if(!p.active&&s.time>=p.returnAt){Object.assign(p,point(p.id));p.active=true;}
    if(D.delivery&&s.cargo>0&&dist(s.player,s.depot)<s.depot.r){s.score+=s.cargo*D.delivery.value;s.delivered+=s.cargo;s.cargo=0;sound(800);if(D.delivery.component==='relay')s.depot.x=s.depot.x>400?65:735;}
    for(const p of s.sites){p.cooldown=Math.max(0,p.cooldown-dt);if(!p.cooldown&&dist(s.player,p)<p.r&&(D.territory.component==='hold'||keys.has('Space'))){p.progress+=dt;if(p.progress>=D.territory.value){s.score+=3;s.captured++;p.progress=0;p.cooldown=5;sound(650);}}}
    for(const e of s.enemies){if(D.pursuit.component==='chase'){const d=dist(e,s.player)||1;e.x+=(s.player.x-e.x)/d*65*dt;e.y+=(s.player.y-e.y)/d*65*dt;}else {e.phase+=dt*.65;e.x=400+Math.cos(e.phase)*240;e.y=250+Math.sin(e.phase)*150;}
      if(dist(e,s.player)<e.r+s.player.r&&s.invulnerable===0){s.health-=10;s.hits++;s.invulnerable=2;sound(150);}}
    if(s.time>=s.nextScore){s.score++;s.nextScore+=8;}
    if(s.time>=300||s.wall>=420||s.health<=0){s.mode='end';keys.clear();}
  }
  const circle=(x,y,r,fill)=>{ctx.fillStyle=fill;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();};
  function draw(){ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);ctx.strokeStyle='#ffffff0d';ctx.lineWidth=1;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    if(recipe.layout==='lanes'){ctx.fillStyle='#ffffff08';for(let i=0;i<3;i++)ctx.fillRect(40,70+i*140,720,65);}
    for(const site of s.sites){circle(site.x,site.y,site.r,site.cooldown?'#4c5b61':'#2a6064');ctx.strokeStyle=accent;ctx.lineWidth=4;ctx.beginPath();ctx.arc(site.x,site.y,site.r,-Math.PI/2,-Math.PI/2+Math.PI*2*site.progress/D.territory.value);ctx.stroke();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='12px sans-serif';ctx.fillText(D.territory.component==='hold'?'HOLD':'SPACE',site.x,site.y+4);}
    if(D.delivery){ctx.strokeStyle=gold;ctx.lineWidth=3;ctx.strokeRect(s.depot.x-26,s.depot.y-26,52,52);ctx.fillStyle=gold;ctx.font='11px sans-serif';ctx.textAlign='center';ctx.fillText('DELIVER',s.depot.x,s.depot.y-34);}
    for(const p of s.pickups)if(p.active){ctx.fillStyle=gold;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.PI/4);ctx.fillRect(-7,-7,14,14);ctx.restore();}
    for(const e of s.enemies){circle(e.x,e.y,e.r,'#ff6c84');ctx.fillStyle=bg;ctx.fillRect(e.x-6,e.y-3,4,4);ctx.fillRect(e.x+2,e.y-3,4,4);}
    circle(s.player.x,s.player.y,s.player.r+5,s.invulnerable>0?'#ffffff80':'#ffffff20');circle(s.player.x,s.player.y,s.player.r,accent);ctx.fillStyle=bg;ctx.fillRect(s.player.x-3,s.player.y-5,6,10);
    if(s.cargo){ctx.fillStyle=gold;ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.fillText('+'+s.cargo,s.player.x,s.player.y-23);}
    el('clock').textContent=Math.ceil(300-s.time)+'s';el('clock').style.color=s.time>=240?'#ffb5b5':'';el('score').textContent=s.score;
    el('health').textContent=Math.max(0,s.health);el('energy').textContent=D.resources?Math.ceil(s.energy):'—';el('level').textContent=D.progression?s.level+'/2':'—';
    el('overlay').hidden=s.mode==='play';el('overlay-title').textContent=s.mode==='title'?recipe.title:s.mode==='pause'?'Paused · '+Math.ceil(s.pauseLease)+'s left':s.health<=0?'Run ended':'Run complete';
    el('overlay-copy').textContent=s.mode==='title'?recipe.goal:s.mode==='pause'?'Your five-minute clock is stopped. Pause allowance does not reset.':'Score '+s.score+' · Upgrades '+s.level+' · '+s.collected+' collected · '+s.delivered+' delivered · '+s.captured+' captured';
    el('play').hidden=s.mode!=='title';el('resume').hidden=s.mode!=='pause';el('restart').hidden=s.mode==='title';el('exit').hidden=s.mode==='title';
    el('upgrade').hidden=!D.progression||s.mode!=='play';el('upgrade').disabled=!D.progression||s.level>=2||s.score<(s.level+1)*D.progression.value;el('upgrade').textContent=s.level>=2?'Upgrades complete':'U · '+(D.progression?.component==='speed'?'Speed +20%':'Health +20 / reach +5')+' · '+((s.level+1)*(D.progression?.value??0))+' score';
  }
  el('title').textContent=recipe.title;el('goal').textContent=recipe.goal;
  el('roles').textContent=Object.entries(D).map(([id,d])=>id+': '+d.role).join(' · ');
  el('legend').textContent=recipe.playerName+' = circle'+(D.collection||D.delivery||D.resources?.component==='refill'?' · '+recipe.itemName+' = diamonds':'')+(D.pursuit?' · '+recipe.threatName+' = pink opponents':'');
  el('play').onclick=start;el('resume').onclick=pause;el('pause').onclick=pause;el('restart').onclick=()=>{reset();start();};el('exit').onclick=reset;el('upgrade').onclick=upgrade;
  addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();keys.add(e.code);if(e.repeat)return;if(e.code==='Enter')start();if(e.code==='Escape')pause();if(e.code==='KeyR'){reset();start();}if(e.code==='KeyU')upgrade();if(e.code==='KeyF'){if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen().catch(()=>{});}});
  addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>{keys.clear();if(s.mode==='play')pause();});
  window.render_game_to_text=()=>JSON.stringify({coordinates:'origin top left; x right, y down',...s,domains:D});
  window.advanceTime=ms=>{if(!Number.isFinite(ms)||ms<0||ms>420000)throw Error('Invalid simulation interval');manual=true;const count=Math.ceil(ms/(1000/60));for(let i=0;i<count;i++)step(ms/1000/count);draw();};
  function frame(now){if(!manual){let remaining=Math.min(420,(now-last)/1000);while(remaining>0){const dt=Math.min(1/60,remaining);step(dt);remaining-=dt;}draw();}last=now;requestAnimationFrame(frame);}reset();requestAnimationFrame(frame);
}

export function gameHTML(recipe,seed){
  const data=JSON.stringify(recipe).replaceAll('<','\\u003c');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Arcade experiment</title>
<style>*{box-sizing:border-box}body{margin:0;background:#101820;color:#eff5f7;font:15px system-ui}main{max-width:1000px;margin:auto;padding:18px}h1{font-size:24px;margin:0}header{display:flex;align-items:center;justify-content:space-between;gap:16px}button{border:0;border-radius:8px;background:#c8efdf;color:#14251e;padding:11px 17px;cursor:pointer;font-weight:650}button:disabled{opacity:.55;cursor:default}button:focus-visible{outline:3px solid #ffcf6b;outline-offset:3px}p{line-height:1.5}#goal{margin:8px 0 15px;color:#c6d8df}.stats{display:flex;flex-wrap:wrap;gap:24px;padding:12px 0;font-variant-numeric:tabular-nums}.stage{position:relative}canvas{display:block;width:100%;aspect-ratio:8/5;border:1px solid #62777f;border-radius:12px}#overlay{position:absolute;inset:0;display:grid;place-content:center;text-align:center;background:#08121be8;padding:24px;border-radius:12px}#overlay[hidden]{display:none}#overlay h2{font-size:32px;margin:0 0 12px}#overlay p{max-width:580px}.actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}small,details{color:#b8cbd3}details{margin-top:12px}summary{cursor:pointer}#upgrade{margin-top:10px}#legend{margin:10px 0;font-size:12px}</style>
<main><header><h1 id="title"></h1><button id="pause">Pause</button></header><p id="goal"></p><div class="stats"><b id="clock">300s</b><span>Score <b id="score">0</b></span><span>Health <b id="health">100</b></span><span>Energy <b id="energy"></b></span><span>Upgrade <b id="level"></b></span></div><div class="stage"><canvas aria-label="Arcade game arena"></canvas><section id="overlay"><h2 id="overlay-title"></h2><p id="overlay-copy"></p><p>WASD / arrows: move · Space: activate · U: upgrade<br>Escape: pause · R: restart · F: fullscreen</p><div class="actions"><button id="play">Play</button><button id="resume">Resume</button><button id="restart">Restart</button><button id="exit">Exit to title</button></div></section></div><button id="upgrade"></button><p id="legend"></p><details><summary>Settings and domain details</summary><label><input id="sound" type="checkbox"> Sound</label><p id="roles"></p><p>Five-minute run; two minutes total pause allowance. Internal generated candidate.</p></details></main>
<script>(${mountGame.toString()})(${data},${seed});</script></html>`;
}
