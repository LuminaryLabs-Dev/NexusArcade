import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {storage,atomicJSON,loadJSON,digest,acceptedIndex,writerLease,verifyEvidence} from './factory.mjs';
const file=path.join(storage,'library-index.json');
export async function rejectPreview(id,{reason,evidenceRefs}){
 if(!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,70}$/.test(id)||!reason?.trim()||!evidenceRefs?.length)throw Error('Preview rejection needs identity, finding and evidence');
 const release=await writerLease('reject-'+id.slice(0,60));
 try{
  for(const ref of evidenceRefs)await verifyEvidence(ref);
  if((await acceptedIndex()).games.some(g=>g.id===id))throw Error('Use factory revocation for accepted history');
  const spineFile=path.join(storage,id,'spine.json'),s=await loadJSON(spineFile);
  if(s.id!==id||!['development','foundation-pilot'].includes(s.purpose)||!['NEEDS_REVIEW','FAIL'].includes(s.status))throw Error('Not a terminal development preview');
  s.externalReview={verdict:'FAIL',reason,evidenceRefs,at:Date.now()};s.status='FAIL';s.previewVerdict='FAIL';s.error=reason;
  const index=await loadJSON(file,{version:1,revision:0,games:[]});
  // Remove discoverability first; interruption cannot leave a failed playable card.
  index.games=index.games.filter(g=>g.id!==id);index.revision++;
  await atomicJSON(file,index);await atomicJSON(spineFile,s);return s.externalReview;
 }finally{await release();}
}
export async function indexPreview(id,classification='development'){
 if(!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,70}$/.test(id))throw Error('Invalid library ID');
 if(!['historical','development'].includes(classification))throw Error('Invalid library classification');
 const dir=path.join(storage,id),s=await loadJSON(path.join(dir,'spine.json'));
 if(s.status!=='PASS'&&s.previewVerdict!=='PASS')throw Error('No passing preview');
 const artifactDir=path.join(storage,s.candidateId??id);
 if(digest(await readFile(path.join(artifactDir,'index.html')))!==s.artifactHash)throw Error('Changed preview artifact');
 if(digest(await readFile(path.join(artifactDir,'review.png')))!==s.browser?.screenshotHash)throw Error('Changed preview image');
 const index=await loadJSON(file,{version:1,revision:0,games:[]});
 const row={id,title:s.composition?.title??s.id,instructions:s.composition?.instructions??s.composition?.goal??'',controls:s.composition?.controls??'WASD / arrows + E',concepts:s.composition?.concepts??[],actions:s.composition?.kind==='rally'?['steer','brake','checkpoints']:s.composition?.kind==='conduit'?['turn valves','connect flow']:s.composition?.kind==='courier'?['carry','deliver']:[...new Set(s.composition?.nodes.map(n=>n.action)??[])],classification,artifactHash:s.artifactHash,sourceHash:s.sourceHash,started:s.started};
 const old=index.games.findIndex(x=>x.id===id);if(old<0)index.games.push(row);else index.games[old]=row;
 index.revision++;await atomicJSON(file,index);return row;
}
export async function library({query='',offset=0,limit=24}={}){
 if(typeof query!=='string'||query.length>120||!Number.isInteger(offset)||offset<0||!Number.isInteger(limit)||limit<1||limit>48)throw Error('Invalid library page');
 const [preview,accepted]=await Promise.all([loadJSON(file,{revision:0,games:[]}),acceptedIndex()]);
 const active=accepted.games.filter(x=>!x.revoked),activeIds=new Set(active.map(x=>x.id));
 const rows=[...active.map(x=>({...x,classification:'accepted'})),...preview.games.filter(x=>!activeIds.has(x.id))].sort((a,b)=>b.started-a.started);
 const needle=query.trim().toLowerCase(),filtered=rows.filter(g=>!needle||[g.title,g.instructions,...g.concepts??[],...g.actions??[]].join(' ').toLowerCase().includes(needle));
 return {revision:preview.revision+':'+accepted.revision,total:filtered.length,accepted:active.length,previewCount:preview.games.length,offset,limit,games:filtered.slice(offset,offset+limit).map(g=>({id:g.id,title:g.title,instructions:g.instructions,controls:g.controls,concepts:g.concepts,actions:g.actions,classification:g.classification})),next:offset+limit<filtered.length?offset+limit:null};
}
