"""Verify analysis coverage and archive integrity, then remove expanded originals."""
import json,hashlib,pathlib,shutil,urllib.request,datetime
from importlib.machinery import SourceFileLoader
pack=SourceFileLoader('archive_pack',str(pathlib.Path(__file__).with_name('archive-pack.py'))).load_module()
B=pack.BASE;R=pack.ROOT
old=json.loads((B/'manifest.json').read_text());restore=json.loads((B/'archive/restore.json').read_text());checkpoint=json.loads((B/'packing-checkpoint.json').read_text());models=json.loads((B/'summaries/model-checkpoint.json').read_text())
assert checkpoint['archiveVerified'] is True, 'Full restoration must finish first'
inputs=json.loads((B/'model-inputs.json').read_text());assert {x['id'] for x in inputs}=={x['id'] for x in models['families']}
assert models.get('merged'), 'Merged summary required'
sourceIds={x['id'] for x in old['games']};covered={sid for f in models['families'] for sid in f['sourceIds']};assert sourceIds==covered
h=hashlib.sha256()
for part in restore['parts']:
 p=B/part['path'];assert p.stat().st_size==part['bytes'] and pack.sha(p)==part['sha256'];assert p.stat().st_size<100_000_000
 with p.open('rb') as f:
  for chunk in iter(lambda:f.read(1048576),b''):h.update(chunk)
assert h.hexdigest()==restore['streamSha256']
for part in checkpoint['records']:
 p=B/part['path'];assert pack.sha(p)==part['sha256'] and p.stat().st_size<=50_000_000
 with p.open() as f:
  for line in f:json.loads(line)
for p,hash_ in checkpoint['controls'].items():assert pack.sha(p)==hash_,'Campaign changed'
lib=json.load(urllib.request.urlopen('http://127.0.0.1:4318/api/library',timeout=10));assert lib['total']==0 and lib['accepted']==0
# Treat local-model drafts as evidence-linked suggestions, not authoritative observations.
for family in models['families']:
 family['reviewDisposition']='advisory-only; historical aggregate, not a reproduced diagnosis'
 family['reviewFlags']=['No current-runtime verification','No new image/audio review','No demonstrated before/after causality']
 if family['id']=='unspecified-v1':
  family['reviewDisposition']='rejected: historical PASS labels cannot establish acceptable performance'
  family['reviewFlags'].append('Unsupported performance inference in raw model hypothesis')
models['mergeReview']='Do not generalize the steering-polarity hypothesis across families. Reproduce each recorded failure against its owning source version first.'
# Consolidate summaries, merge and model receipts into a single JSONL stream.
summaryRows=[{'type':'family-summary',**x} for x in models['families']]+[{'type':'merged-summary','status':'hypothesis','sourceFamilies':[x['id'] for x in models['families']],'model':'arcade-writer','reviewDisposition':models['mergeReview'],**models['merged']}]+[{'type':'model-receipt',**x} for x in models['calls']]+[{'type':'model-identities','models':models['models']}]
summaryParts=pack.shards(B/'summaries',summaryRows)
lessons=[json.loads(l) for l in (B/'lessons.jsonl').read_text().splitlines()];assert len(lessons)==len(inputs)
assert {sid for l in lessons for sid in l['sourceIds']}==sourceIds
for l in lessons:assert l['status']=='hypothesis' and l['evidenceRefs'] and 'contradictoryEvidence' in l
for l in lessons:
 family=next(f for f in models['families'] if f['id']==l['family'])
 l['reviewDisposition']=family['reviewDisposition'];l['reviewFlags']=family['reviewFlags']
 if family['id']=='unspecified-v1':l['proposedChangeOrInvestigation']='Reconcile historical PASS outcomes with the full current acceptance contract; do not infer quality from labels.'
# Verified mechanical facts are separate from model interpretations.
lessons.extend([{'id':'verified-storage','status':'verified','scope':'archive storage only','sourceIds':['original-metadata/manifest.json'],'supportingEvidence':old['cleanup'],'contradictoryEvidence':[],'finding':'Repeated runtime snapshots contained byte-identical dependencies. Hard-link deduplication preserved every original path and hash.','proposedChangeOrInvestigation':'Evaluate content-addressed dependency storage for future generation. This proposal is not implemented by archive packing.'},{'id':'verified-evidence-gaps','status':'verified','scope':'historical reference integrity only','sourceIds':['original-metadata/manifest.json'],'supportingEvidence':old['referenceAudit'],'contradictoryEvidence':[],'finding':'Historical references include missing and hash-mismatched targets. No automatic quality acceptance follows from these records.','proposedChangeOrInvestigation':'Resolve missing and stale evidence before trusting historical phase completion.'}])
(B/'lessons.jsonl').write_text(''.join(json.dumps(x,separators=(',',':'))+'\n' for x in lessons))
merged=models['merged'];lines=['# Built Unproven — Final Archive Brief','','## Verified outcome',f'- Preserved {old["fileCount"]:,} original files in {len(restore["parts"])} compressed shards; full restoration and original hashes verified.',f'- Extracted {len(sourceIds)} experiment records across {len(inputs)} families, plus file provenance and historical reference issues.','- All JSONL records are complete lines; shards target 50 MB and every deliverable is below 100 MB.','- Active arcade remains empty. Original G01–G33 identities and campaign state are unchanged by this packing pass.','','## What the archive can establish','- Repeated runtime storage and recorded errors are inspectable facts. Historical PASS statuses are not proof of a good game.','- 480 historical evidence references matched; 410 were missing and 18 mismatched before packing. Their exact issue records remain in factual JSONL and the original archive.','- This pass did not play games, inspect screenshots with the model, listen to audio, retrain models or implement proposed harness corrections.','','## Local-model synthesis (hypotheses)']
lines+=['', 'Reviewer limit: '+models['mergeReview'], '', 'This synthesis is retained as a model draft, not an adopted correction.']
for field in ['observation','hypothesis','nextCheck','contradictions','missingEvidence']:lines+=['',f'**{field}:** {merged[field]}']
lines+=['','## Family findings']
for f in models['families']:
 x=f['interpretation'];lines += ['',f'### {f["id"]} — {f["facts"]["count"]} experiments',f'- Recorded statuses: {json.dumps(f["facts"]["recordedStatuses"])}',f'- Recorded error counts: {json.dumps(f["facts"]["errorCounts"])}',f'- Model draft: {x["observation"]}',f'- Proposed investigation (unverified): {x["nextCheck"]}',f'- Review disposition: {f["reviewDisposition"]}',f'- Conflicts/limits: {x["contradictions"]} {x["missingEvidence"]}']
lines+=['','## Evidence-grounded priorities','- Conduit: 18 recorded clearance failures and six stalled routes. Reproduce reachability failures before proposing geometry changes.','- Rally: six recorded shortcut-timing failures and two camera-relative steering failures. Compare affected source versions; do not assume these still occur.','- Generation/review: recorded schema/protocol failures and contradictory image-review claims warrant targeted validator checks.','- Newer scene experiments: recorded missed short inputs, text repaint artifacts and presentation overrides suggest specific shared-system checks.','- None of these recorded failures proves the latest source still needs the same repair.','','## Next audit pass','1. Use factual records to select failing and contrasting examples. Recover originals only when needed.','2. Test the hypothesis before changing a shared catalog, matching rule, capability, or validator.','3. Generate a new candidate through the harness, compare it against the failing and independent cases, and record the result.','4. Promote a hypothesis to a verified lesson only when direct evidence supports it. Preserve contradictions and original deadlines.']
(B/'final-brief.md').write_text('\n'.join(lines)+'\n')
(B/'README.md').write_text('''# Built Unproven Archive

## Start here
Read `final-brief.md` for conclusions and proposed investigations. `lessons.jsonl` separates verified archive facts from model hypotheses. This packet contains retired experiments, not accepted games.

## Packet tree
```text
built-unproven/
|-- README.md
|-- manifest.json
|-- archive/
|   |-- originals.tar.gz.part-001
|   `-- originals.tar.gz.part-002
|-- records/
|   `-- part-001.jsonl
|-- summaries/
|   `-- part-001.jsonl
|-- lessons.jsonl
`-- final-brief.md
```
The manifest is authoritative if shard counts differ. The compressed shards stay local and Git-ignored. JSONL contains analysis records, not encoded screenshots or repeated runtime code. A Git checkout without archive shards cannot restore the original games.

## Analysis and provenance
`records/` contains one factual record per experiment, full compositions, selected SPINE fields, results and evidence references; it also contains every original file hash and historical reference issues. Fields not selected for analysis remain in the originals. Experiment families are deterministic groups, not proven novelty classes. Every experiment contributes to family totals; local models receive aggregates and an explicitly sampled subset of examples rather than the entire source corpus.

`summaries/` contains the family interpretations, their merged interpretation, model identities and call receipts. LFM2.5 Thinking 1.2B analyzed families; LFM2.5 VL 3B edited the combined text. No new visual review occurred. These models are summarizers, not independent proof of their claims. Reference IDs preserve contradictory recorded outcomes and unverified gaps.

## Restore
1. Verify each archive part against `manifest.json`, then concatenate parts in its listed order. These are segments of one gzip stream, not independent archives.
2. Verify the joined stream SHA-256 and extract it into an empty staging directory. Never overwrite active storage.
3. The extracted `original-metadata/manifest.json` lists every original file SHA-256. Validate all files under the extracted `NexusArcade-Experiments/` against it.
4. The archive preserves internal hard links. Treat restored archived runtime files as immutable; create independent writable copies for experiments.
5. Full historical recovery can use the extracted experiment tree after protecting newer work. Restore neither historical acceptance claims nor expired deadlines without revalidation.

Example from this folder (use the manifest order if more shards exist):
```sh
cat archive/originals.tar.gz.part-* > /tmp/nexus-originals.tar.gz
mkdir /tmp/nexus-restored
 tar -xzf /tmp/nexus-originals.tar.gz -C /tmp/nexus-restored
```
Verify hashes before extraction; the example assumes fresh temporary paths. A concatenated restoration file may exceed 100 MB for future larger packets even though each stored part is smaller.

## Campaign boundary
The original 33 goals are unchanged. The campaign remains incomplete and the active arcade empty. Historical G01/G02 completion flags and G03 review state are retained as history, not endorsed by these summaries. Existing missing/mismatched evidence remains unresolved.
''')
# Verify original source one last time before removal.
pack.verify_tree(pack.SOURCE,{e['path']:e for e in old['files']})
manifest={'formatVersion':2,'title':'Built Unproven Archive','created':datetime.datetime.now(datetime.timezone.utc).isoformat(),'originals':restore,'records':checkpoint['records'],'summaries':summaryParts,'experiments':len(sourceIds),'families':len(inputs),'lessons':len(lessons),'modelCalls':len(models['calls']),'modelCallErrorsRetained':sum(bool(c.get('error')) for c in models['calls']),'referenceAudit':old['referenceAudit'],'verification':{'fullRestoration':'PASS','everyOriginalHash':'PASS','experimentCoverage':'PASS','completeJSONLLines':'PASS','campaignUnchanged':'PASS','activeLibraryEmpty':'PASS'},'previousCleanup':old['cleanup'],'limits':{'targetShardBytes':50_000_000,'maxFileBytesExclusive':100_000_000},'files':[]}
keep=[B/'README.md',B/'final-brief.md',B/'lessons.jsonl']+[B/p['path'] for p in restore['parts']+checkpoint['records']+summaryParts]
for p in keep:
 assert p.stat().st_size<100_000_000
 manifest['files'].append({'path':str(p.relative_to(B)),'bytes':p.stat().st_size,'sha256':pack.sha(p)})
# Write new manifest before cleanup; originals include the complete previous metadata.
pack.write(B/'manifest.json',manifest)
shutil.rmtree(pack.SOURCE)
for name in ['summary.json','model-inputs.json','packing-checkpoint.json','summaries/model-checkpoint.json','summaries/families-001.jsonl','summaries/merge.json','archive/restore.json']:
 p=B/name
 if p.exists():p.unlink()
assert all(pack.sha(B/e['path'])==e['sha256'] for e in manifest['files'])
assert all(p.stat().st_size<100_000_000 for p in B.rglob('*') if p.is_file())
print(json.dumps({'complete':True,'files':len(list(p for p in B.rglob('*') if p.is_file())),'storedBytes':sum(p.stat().st_size for p in B.rglob('*') if p.is_file()),'experiments':len(sourceIds),'families':len(inputs),'modelCalls':len(models['calls']),'parts':restore['parts']},indent=2))
