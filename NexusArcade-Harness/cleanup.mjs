import {readdir,readFile,lstat,realpath,unlink} from 'node:fs/promises';
import path from 'node:path';
import {storage,loadJSON,atomicJSON,digest,writerLease,acceptedIndex} from './factory.mjs';

// Failed output is disposable; its spine, composition, diagnostic images and
// referenced evidence are not. Shared runtime snapshots are never removed here.
export async function cleanupFailed(id,{apply=false}={}){
 if(!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,70}$/.test(id))throw Error('Invalid cleanup ID');
 const release=await writerLease('cleanup-'+id.slice(0,60));
 try{
  const base=await realpath(storage),dir=path.join(base,id),resolved=await realpath(dir);
  if(resolved!==dir)throw Error('Cleanup refuses linked directories');
  const spinePath=path.join(dir,'spine.json'),s=await loadJSON(spinePath);
  if(s.id!==id||s.status!=='FAIL'||s.previewVerdict==='PASS')throw Error('Cleanup requires a failed, non-passing attempt');
  if((await acceptedIndex()).games.some(g=>g.id===id||g.candidateId===id))throw Error('Accepted history references attempt');
  const library=await loadJSON(path.join(base,'library-index.json'),{games:[]});
  if(library.games.some(g=>g.id===id||g.candidateId===id))throw Error('Library references attempt');
  const target=path.join(dir,'index.html'),references=[];
  async function scan(folder){for(const entry of await readdir(folder,{withFileTypes:true})){
   if(entry.name.startsWith('.')||entry.isSymbolicLink())continue;
   const file=path.join(folder,entry.name);if(file===dir)continue;
   if(entry.isDirectory()){await scan(file);continue;}
   if(!entry.isFile()||!entry.name.endsWith('.json'))continue;
   const doc=JSON.parse(await readFile(file,'utf8'));
   function walk(x,key=''){
    if(typeof x==='string'){
     if((['candidateId','artifactId'].includes(key)&&x===id)||path.resolve(base,x)===target||x.includes('/'+id+'/index.html'))references.push(path.relative(base,file));
    }else if(x&&typeof x==='object')for(const [k,v] of Object.entries(x))walk(v,k);
   }walk(doc);
  }}
  await scan(base);
  const manifest={id,scope:'failed launch artifact only',status:apply?'APPLIED':'DRY_RUN',retained:['spine.json','composition.json','diagnostic images','shared runtime snapshots'],references:[...new Set(references)],files:[]};
  if(references.length){manifest.status='RETAINED_REFERENCED';return manifest;}
  let info;try{info=await lstat(target);}catch(e){if(e.code!=='ENOENT')throw e;}
  if(info){if(!info.isFile()||info.isSymbolicLink())throw Error('Cleanup refuses nonregular artifacts');manifest.files.push({path:path.relative(base,target),sha256:digest(await readFile(target)),bytes:info.size});}
  if(apply){
   // Persist intent before removal; rerunning after interruption is idempotent.
   const receipt=path.join(dir,'cleanup.json'),previous=await loadJSON(receipt,null);
   const removedFiles=[...new Map([...(previous?.removedFiles??previous?.files??[]),...manifest.files].map(f=>[f.path,f])).values()];
   await atomicJSON(receipt,{...manifest,removedFiles,status:'REMOVING',at:Date.now()});
   for(const f of manifest.files){if(digest(await readFile(target))!==f.sha256)throw Error('Artifact changed during cleanup');await unlink(target);}
   await atomicJSON(receipt,{...manifest,removedFiles,at:Date.now()});
  }
  return manifest;
 }finally{await release();}
}
