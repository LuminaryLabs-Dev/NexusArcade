# Built Unproven Archive

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
