import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {generate,experiments,root,safeId} from './harness.mjs';
import {library,indexPreview} from './library.mjs';
import {queueSnapshot,writerLease} from './factory.mjs';
let active=null,controller=null,playerSession=null,releasePlayer=null;const port=Number(process.env.PORT??4318);
const server=createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://127.0.0.1:'+port);
 if(req.headers.host!==`127.0.0.1:${port}`&&req.headers.host!==`localhost:${port}`){res.writeHead(403);return res.end();}
 if(req.method==='POST'&&req.headers.origin&&!['http://127.0.0.1:'+port,'http://localhost:'+port].includes(req.headers.origin)){res.writeHead(403);return res.end();}
 res.setHeader('Cache-Control','no-store');
 if(url.pathname==='/api/library'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(await library({query:url.searchParams.get('q')??'',offset:Number(url.searchParams.get('offset')??0),limit:Number(url.searchParams.get('limit')??24)})));}
 if(url.pathname==='/api/queue'){res.setHeader('Content-Type','application/json');const q=await queueSnapshot();return res.end(JSON.stringify({contractHash:q.contractHash,goals:q.goals.map(g=>({id:g.id,title:g.title,status:g.status,acceptedGameTarget:g.acceptedGameTarget}))}));}
 if(url.pathname==='/api/state'){let current=active;try{const lock=JSON.parse(await readFile(path.join(experiments,'.writer.lock'),'utf8'));if(lock.pid!==process.pid){const s=JSON.parse(await readFile(path.join(experiments,safeId(lock.id),'spine.json'),'utf8'));current={id:s.id,status:s.status,elapsedMs:Date.now()-s.started,external:true};}}catch{}res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({active:current,playerActive:!!playerSession,concurrency:'unverified; generation admission disabled during play',ideaLimitSeconds:1500}));}
 if(req.method==='POST'&&url.pathname==='/api/player'){
  let body='';for await(const c of req){body+=c;if(body.length>1024)throw Error('Request too large');}
  const data=JSON.parse(body);if(!['open','close'].includes(data.action)||!/^[-a-zA-Z0-9]{1,80}$/.test(data.session??''))throw Error('Invalid player session');
  if(data.action==='open'){
   if(playerSession&&playerSession!==data.session){res.writeHead(409);return res.end('Another player is open');}
   if(!playerSession){playerSession=data.session;try{releasePlayer=await writerLease('player-'+data.session);}catch(e){playerSession=null;res.writeHead(409);return res.end('Finish or cancel generation before playing');}}
  }else if(playerSession===data.session){await releasePlayer?.();releasePlayer=null;playerSession=null;}
  return res.end('OK');
 }
 if(req.method==='POST'&&url.pathname==='/api/generate'){
  if(playerSession){res.writeHead(409);return res.end('Return to the arcade before generating');}
  if(active&&!['PASS','FAIL','CANCELLED','NEEDS_REVIEW'].includes(active.status)){res.writeHead(409);return res.end('A generation is already running');}
  let body='';for await(const c of req){body+=c;if(body.length>2048)throw Error('Request too large');}
  const {depth=1,seed=Math.floor(Math.random()*4294967295)}=JSON.parse(body||'{}');
  if(![1,2,3].includes(depth)||!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Invalid depth or seed');
  const id='game-'+Date.now();controller=new AbortController();active={id,status:'QUEUED'};
  generate({id,seed,depth,signal:controller.signal,onProgress:p=>active=p}).then(async s=>{if(s.previewVerdict==='PASS')await indexPreview(id);active={id,status:s.status,error:s.error};}).catch(e=>active={id,status:'FAIL',error:e.message});
  res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({id}));
 }
 if(req.method==='POST'&&url.pathname==='/api/cancel'){controller?.abort();return res.end('Cancellation requested');}
 if(url.pathname.startsWith('/.runtime/')){const relative=decodeURIComponent(url.pathname);if(!/^\/\.runtime\/[a-f0-9]{64}\/[a-zA-Z0-9_./-]+$/.test(relative)||relative.split('/').includes('..'))throw Error('Invalid runtime path');res.setHeader('Content-Type',/\.(mjs|js)$/.test(relative)?'text/javascript':'application/json');return res.end(await readFile(path.join(experiments,relative)));}
 if(url.pathname.startsWith('/games/')){const parts=url.pathname.split('/');const id=safeId(parts[2]);if(parts.length!==4||!['index.html','review.png','spine.json','composition.json','overview.png'].includes(parts[3]))throw Error('Unknown artifact');res.setHeader('Content-Type',parts[3].endsWith('.png')?'image/png':parts[3].endsWith('.json')?'application/json':'text/html; charset=utf-8');let artifactId=id;if(parts[3]!=='spine.json'){try{const s=JSON.parse(await readFile(path.join(experiments,id,'spine.json')));artifactId=safeId(s.candidateId??id);}catch(e){if(e.code!=='ENOENT')throw e;}}return res.end(await readFile(path.join(experiments,artifactId,parts[3])));}
 if(url.pathname==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');return res.end(await readFile(path.join(root,'ui.html')));}
 res.writeHead(404);res.end('Not found');
 }catch(e){res.writeHead(400);res.end(e.message);}});
server.listen(port,'127.0.0.1',()=>console.log('Arcade Harness: http://127.0.0.1:'+port));
for(const sig of ['SIGINT','SIGTERM'])process.on(sig,async()=>{controller?.abort();await releasePlayer?.();server.close();});
