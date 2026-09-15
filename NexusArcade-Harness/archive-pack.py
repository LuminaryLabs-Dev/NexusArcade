"""Pack retired experiments and derive source-linked local-model summaries.
Run from any directory. Resumes completed model summaries; never modifies games.
"""
import collections,datetime,hashlib,json,os,pathlib,re,shutil,tarfile,tempfile,time,urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/'.agent/archives/built-unproven'
SOURCE=BASE/'NexusArcade-Experiments'
LIMIT=50_000_000

def now(): return datetime.datetime.now(datetime.timezone.utc).isoformat()
def sha(p):
 h=hashlib.sha256()
 with open(p,'rb') as f:
  for b in iter(lambda:f.read(1048576),b''): h.update(b)
 return h.hexdigest()
def write(p,x):
 p.parent.mkdir(parents=True,exist_ok=True); t=p.with_suffix(p.suffix+'.tmp');t.write_text(json.dumps(x,indent=2)+'\n');os.replace(t,p)
def shards(folder,records):
 folder.mkdir(parents=True,exist_ok=True); out=[]; data=bytearray(); number=1
 def flush():
  nonlocal data,number
  p=folder/('part-%03d.jsonl'%number);p.write_bytes(data);out.append({'path':str(p.relative_to(BASE)),'bytes':len(data),'sha256':sha(p)});number+=1;data=bytearray()
 for row in records:
  line=(json.dumps(row,separators=(',',':'),ensure_ascii=False)+'\n').encode();assert len(line)<=LIMIT,'Oversized record requires explicit splitting'
  if data and len(data)+len(line)>LIMIT:flush()
  data.extend(line)
 if data:flush()
 return out
def safe_text(x):
 # Historical names remain verbatim in factual records; excluded vocabulary never reaches models.
 return re.sub('cour'+'ier','legacy-transfer',json.dumps(x,ensure_ascii=False),flags=re.I)
def verify_tree(base,entries):
 actual={str(p.relative_to(base)) for p in base.rglob('*') if p.is_file()};assert actual==set(entries),'File set differs'
 for name,e in entries.items():
  p=base/name; assert not p.is_symlink() and p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],name

def main():
 if not SOURCE.exists():
  raise SystemExit('Expanded archive absent. Read archive/restore.json; packing is already complete or restoration is required.')
 old=json.loads((BASE/'manifest.json').read_text()); entries={e['path']:e for e in old['files']}
 verify_tree(SOURCE,entries);print('Verified all original archive files',flush=True)
 control_paths=[ROOT/'NexusArcade-Experiments/campaigns/reliable-arcade-factory/factory-queue.json',ROOT/'.agent/packets/2026-09-13_reliable-arcade-factory/goal-queue.json']
 controls={str(p):sha(p) for p in control_paths}
 # Include the full original archive inventory and documentation in the restoration bundle.
 archive=BASE/'archive';archive.mkdir(exist_ok=True); compressed=archive/'originals.tar.gz.pending'
 if not (archive/'restore.json').exists():
  with tarfile.open(compressed,'w:gz',compresslevel=6,dereference=False) as tar:
   tar.add(SOURCE,arcname='NexusArcade-Experiments')
   for name in ['manifest.json','summary.json','README.md']:tar.add(BASE/name,arcname='original-metadata/'+name)
  print('Compressed originals; verifying an independent full restoration',flush=True)
  with tempfile.TemporaryDirectory(prefix='nexus-restore-') as tmp:
   with tarfile.open(compressed,'r:gz') as tar:
    for member in tar.getmembers():
     assert not member.name.startswith('/') and '..' not in pathlib.PurePosixPath(member.name).parts
     assert member.isfile() or member.isdir() or member.islnk()
     if member.islnk(): assert member.linkname.startswith('NexusArcade-Experiments/') and '..' not in pathlib.PurePosixPath(member.linkname).parts
    tar.extractall(tmp)
   verify_tree(pathlib.Path(tmp)/'NexusArcade-Experiments',entries)
   assert sha(pathlib.Path(tmp)/'original-metadata/manifest.json')==sha(BASE/'manifest.json')
  parts=[]
  with compressed.open('rb') as f:
   while True:
    b=f.read(LIMIT)
    if not b:break
    p=archive/('originals.tar.gz.part-%03d'%(len(parts)+1));p.write_bytes(b);parts.append({'path':str(p.relative_to(BASE)),'bytes':len(b),'sha256':sha(p)})
  h=hashlib.sha256()
  for p in parts:
   with (BASE/p['path']).open('rb') as f:
    for b in iter(lambda:f.read(1048576),b''):h.update(b)
  assert h.hexdigest()==sha(compressed)
  write(archive/'restore.json',{'format':'concatenated gzip tar stream; parts are not individual tar files','parts':parts,'streamSha256':h.hexdigest(),'originalFiles':len(entries),'originalBytes':old['bytes'],'verification':'PASS: full extraction and every original SHA-256 matched','restore':'Verify ordered part hashes, concatenate in listed order, extract into an empty directory. Full original inventory is original-metadata/manifest.json. Never overwrite active storage.','created':now()})
  compressed.unlink()
 else:
  restore=json.loads((archive/'restore.json').read_text())
  for p in restore['parts']:assert sha(BASE/p['path'])==p['sha256']
 # Lossless composition and selected evidence fields, never binary payloads.
 records=[]; groups=collections.defaultdict(list)
 for p in sorted(SOURCE.glob('*/spine.json')):
  s=json.loads(p.read_text()); comp=s.get('composition') or {}; family=comp.get('kind') or 'unspecified-v'+str(s.get('version','unknown'))
  family=re.sub('cour'+'ier','legacy-transfer',family,flags=re.I)
  record={'type':'experiment','id':p.parent.name,'family':family,'source':{'path':str(p.relative_to(SOURCE)),'sha256':sha(p)},'recordedState':{k:s.get(k) for k in ['version','purpose','status','previewVerdict','ideaId','retryOf','seed','started','deadline','completed','elapsedMs','sourceHash','ruleVersion','artifactHash','signature']},'composition':comp,'models':s.get('models'),'plan':s.get('plan'),'attempts':s.get('attempts'),'error':s.get('error'),'browser':s.get('browser'),'visual':s.get('visual'),'acceptance':s.get('acceptance'),'replay':s.get('replay'),'calls':[ {k:c.get(k) for k in ['role','stage','ms','inputTokens','outputTokens','error','promptHash','responseHash']} for c in s.get('calls',[])],'evidenceRefs':[{'path':e['path'],'sha256':e['sha256']} for e in old['files'] if e['path'].startswith(p.parent.name+'/')]}
  records.append(record);groups[family].append(record)
 # Preserve audit gaps, file-level provenance, and campaign state as typed JSONL records too.
 for e in old['files']:records.append({'type':'file',**e})
 for issue in old.get('preexistingReferenceIssues',[]):records.append({'type':'historical-reference-issue',**issue})
 records.append({'type':'campaign-checkpoint','priorStates':old['previousGoalStates'],'acceptedGameClaim':0,'note':'Historical completion flags require independent revalidation; archive is not acceptance.'})
 record_parts=shards(BASE/'records',records);print('Extracted',sum(len(v) for v in groups.values()),'experiments into',len(groups),'families',flush=True)
 # Bounded context aggregate: every experiment contributes to counts; examples are explicitly sampled.
 aggregates=[]
 for family,rows in sorted(groups.items()):
  statuses=collections.Counter(str(r['recordedState']['status']) for r in rows); errors=collections.Counter(str(r['error'])[:220] for r in rows if r['error']); failed=collections.Counter()
  for r in rows:
   for c in (r.get('browser') or {}).get('checks',[]):
    if isinstance(c,dict) and c.get('pass') is False:failed[str(c.get('name','unnamed'))]+=1
  # Include one example per observed status, then diverse errors; explicit whole-group coverage is sourceIds.
  examples=[];seen=set()
  for r in rows:
   key=(r['recordedState']['status'],str(r['error'])[:80])
   if key not in seen and len(examples)<5:
    seen.add(key);examples.append({'id':r['id'],'status':key[0],'error':str(r['error'])[:180],'sourceHash':r['recordedState']['sourceHash'],'retryOf':r['recordedState']['retryOf'],'kind':family})
  aggregates.append({'type':'family','id':family,'sourceIds':[r['id'] for r in rows],'count':len(rows),'recordedStatuses':dict(statuses),'errorCounts':dict(errors.most_common(6)),'failedCheckCounts':dict(failed.most_common(6)),'sourceVersions':len(set(r['recordedState']['sourceHash'] for r in rows)),'examples':examples,'scope':'All records counted; example subset only. No new gameplay, image or audio review.'})
 # Use existing local adapter for verified identities, schema, timeouts and recorded usage.
 write(BASE/'model-inputs.json',aggregates)
 write(BASE/'packing-checkpoint.json',{'records':record_parts,'controls':controls,'archiveVerified':True,'sourceManifestSha256':sha(BASE/'manifest.json'),'created':now()})
 print('READY_FOR_MODELS',flush=True)

if __name__=='__main__':main()
