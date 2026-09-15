# Built Unproven — Final Archive Brief

## Verified outcome
- Preserved 64,640 original files in 2 compressed shards; full restoration and original hashes verified.
- Extracted 367 experiment records across 10 families, plus file provenance and historical reference issues.
- All JSONL records are complete lines; shards target 50 MB and every deliverable is below 100 MB.
- Active arcade remains empty. Original G01–G33 identities and campaign state are unchanged by this packing pass.

## What the archive can establish
- Repeated runtime storage and recorded errors are inspectable facts. Historical PASS statuses are not proof of a good game.
- 480 historical evidence references matched; 410 were missing and 18 mismatched before packing. Their exact issue records remain in factual JSONL and the original archive.
- This pass did not play games, inspect screenshots with the model, listen to audio, retrain models or implement proposed harness corrections.

## Local-model synthesis (hypotheses)

Reviewer limit: Do not generalize the steering-polarity hypothesis across families. Reproduce each recorded failure against its owning source version first.

This synthesis is retained as a model draft, not an adopted correction.

**observation:** Multiple families show inconsistent statuses with high review needs.

**hypothesis:** Shared input polarity adjustment may reduce collisions and improve consensus.

**nextCheck:** Testing shared input polarity changes

**contradictions:** Observed mixed statuses while aggregate data shows high review needs.

**missingEvidence:** Error counts consistency is not verified.

## Family findings

### checkpoint — 20 experiments
- Recorded statuses: {"NEEDS_REVIEW": 11, "FAIL": 8, "CANCELLED": 1}
- Recorded error counts: {"undefined is not iterable (cannot read property Symbol(Symbol.iterator)); page.waitForFunction: Timeout 15000ms exceeded.": 2, "Visual review consequence: The player is driving on a road that curves to the right while the direction of travel should be straight based on the checkpoint layout and the 'Reach every beacon in order' goal. The vehicle ": 1, "Visual review detail: The image shows a top-down view of a vehicle on a road with no visible controls or goal-related objects.": 1, "steering view shows the complete controlled vehicle": 1, "CANCELLED": 1, "Visual review detail: The image is a top-down view of a car on a road with no visible controls, goals, or other objects.": 1}
- Model draft: The vehicle's direction mismatch
- Proposed investigation (unverified): Re-run test with updated controls
- Review disposition: advisory-only; historical aggregate, not a reproduced diagnosis
- Conflicts/limits: Multiple failures noted No visual confirmation

### conduit — 75 experiments
- Recorded statuses: {"NEEDS_REVIEW": 31, "FAIL": 37, "CANCELLED": 7}
- Recorded error counts: {"Route endpoint lacks clearance": 18, "CANCELLED": 7, "World route stalled": 6, "Valve interaction did not reach target {\"index\":1,\"rotation\":[3,1,1],\"player\":{\"x\":-3.8999999999999995,\"y\":0,\"z\":2.999999999999994}}": 5, "Valve interaction did not reach target {\"index\":2,\"rotation\":[3,1,1],\"player\":{\"x\":9.900000000000002,\"y\":0,\"z\":-2.1000000000000063}}": 2, "Independent image review: oversized world label occludes the room and target reservoirs despite model approval.": 1}
- Model draft: Family aggregate data shows high needs review
- Proposed investigation (unverified): errorCounts analysis
- Review disposition: advisory-only; historical aggregate, not a reproduced diagnosis
- Conflicts/limits: No contradictions found Insufficient data on image/audio issues

### legacy-transfer — 11 experiments
- Recorded statuses: {"FAIL": 6, "NEEDS_REVIEW": 5}
- Recorded error counts: {"Three.js geometry": 2, "Truncated pilot-review response": 1, "Truncated pilot-write response": 1, "Visual review: The player needs to carry energy cells to bays marked with numbers. The pink cell is on the floor but there is no bay labeled 3, and the yellow cell is on the floor but there is no bay labeled 1. Additiona": 1, "Independent screenshot review: oversized YOU marker obscures the player body; resize and separate the shared marker before publication.": 1}
- Model draft: Family has 11 entries with FAIL and NEEDS_REVIEW
- Proposed investigation (unverified): Shared-harness check for bay labeling accuracy
- Review disposition: advisory-only; historical aggregate, not a reproduced diagnosis
- Conflicts/limits: No direct contradictions found Insufficient data on bay labels

### rally — 47 experiments
- Recorded statuses: {"NEEDS_REVIEW": 27, "FAIL": 19, "CANCELLED": 1}
- Recorded error counts: {"shortcut improves lap beyond timing noise": 6, "Independent camera-relative input audit: right steering moves left in the chase view. Correct shared input polarity before keeping this preview.": 2, "Shared shortcut sign grows into the lower player view; bounded-label correction required.": 2, "same steering mistake costs more collisions on narrow route": 1, "Visual review detail: Car is on road but does not follow instructions to beat best lap or take shortcut as per scene facts": 1, "Visual review detail: The goal is not visible in this view.": 1}
- Model draft: Family aggregate data shows mixed statuses with high review needs
- Proposed investigation (unverified): Testing shared input polarity changes
- Review disposition: advisory-only; historical aggregate, not a reproduced diagnosis
- Conflicts/limits: No direct contradiction found Insufficient visual data for validation

### transfer — 7 experiments
- Recorded statuses: {"NEEDS_REVIEW": 6, "FAIL": 1}
- Recorded error counts: {"Visual review consequence: The player needs to pick up all three cells before delivering them. The player is currently holding cell 1, but cells 2 and 3 are not on the player's body. Additionally, the doors for delivery ": 1}
- Model draft: Observed issue with cell collection
- Proposed investigation (unverified): Verify physical access to cells
- Review disposition: advisory-only; historical aggregate, not a reproduced diagnosis
- Conflicts/limits: No direct contradictions found Lack of concrete evidence for current status

### unspecified-v1 — 97 experiments
- Recorded statuses: {"PASS": 81, "FAIL": 13, "CANCELLED": 3}
- Recorded error counts: {"LM Studio HTTP 400: {\"error\":\"Engine protocol predict stream returned an error: {\\\"code\\\":500,\\\"message\\\":\\\"The model produced output that does not match the expected peg-native format\\\",\\\"type\\\":\\\"server_error\\\"}\"}": 6, "This operation was aborted": 3, "root.domains.territory.role: invalid text": 2, "Goal promises pickups without a pickup source": 1, "root.domains.collection.role: invalid text": 1}
- Model draft: Family aggregate data shows PASS at 81 and FAIL at 13
- Proposed investigation (unverified): Verify error counts consistency
- Review disposition: rejected: historical PASS labels cannot establish acceptable performance
- Conflicts/limits: Missing evidence on causation No direct correlation available

### unspecified-v2 — 72 experiments
- Recorded statuses: {"PASS": 62, "FAIL": 9, "CANCELLED": 1}
- Recorded error counts: {"The operation was aborted due to timeout": 2, "Ended before route completed: won": 2, "Visual review: Platforms and bridges are visible but actor markers (4, 5, 6) are missing or illegible.": 1, "page.click: Target page, context or browser has been closed\nCall log:\n\u001b[2m  - waiting for locator('#start')\u001b[22m\n\u001b[2m    - locator resolved to <button id=\"start\">PLAY</button>\u001b[22m\n\u001b[2m  - attempting click action\u001b[22m\n\u001b[": 1, "page.goto: Timeout 12000ms exceeded.\nCall log:\n\u001b[2m  - navigating to \"http://127.0.0.1:55400/arcade50-final-041/index.html\", waiting until \"load\"\u001b[22m\n": 1, "Visual review: All platforms, bridges, actor and objective markers are visibly rendered and readable.": 1}
- Model draft: Platforms and bridges visible
- Proposed investigation (unverified): Missing evidence on actor marker clarity
- Review disposition: advisory-only; historical aggregate, not a reproduced diagnosis
- Conflicts/limits: No contradiction found Insufficient data on actor marker presence

### unspecified-v3 — 1 experiments
- Recorded statuses: {"NEEDS_REVIEW": 1}
- Recorded error counts: {}
- Model draft: The family record shows one entry needing review
- Proposed investigation (unverified): Shared-harness check
- Review disposition: advisory-only; historical aggregate, not a reproduced diagnosis
- Conflicts/limits: No contradictions found Insufficient data to confirm or deny

### unspecified-v4 — 28 experiments
- Recorded statuses: {"NEEDS_REVIEW": 16, "FAIL": 12}
- Recorded error counts: {"Visual review initial: {\"geometry\":\"visible\",\"labels\":\"readable\",\"player\":\"uncertain\"}": 2, "Dynamic callouts retain faint old glyphs because translucent text backgrounds are repainted without clearing. Clear the shared canvas before replacing its text. The direct routing profile also needs a measured alternativ": 2, "Short interaction presses can disappear between simulation updates. Shared input buffering fixes later runtime; this expired preview cannot be repaired or qualified.": 2, "Independent image audit: completion overlay obscures gameplay in consequence frame; model visibility approval is unsupported.": 1, "Writer changed the catalog-selected lagoon presentation to violet; preserve composition-owned presentation.": 1, "Player-facing title promises an unsupported action; image review invents gameplay claims.": 1}
- Model draft: Observed inconsistencies in shared resources
- Proposed investigation (unverified): Review label consistency across versions
- Review disposition: advisory-only; historical aggregate, not a reproduced diagnosis
- Conflicts/limits: Conflicting error reports Insufficient data on resolution methods

### unspecified-vunknown — 9 experiments
- Recorded statuses: {"BUILT_UNVALIDATED": 7, "REGRESSION_PASS": 2}
- Recorded error counts: {}
- Model draft: Some family members lack complete data
- Proposed investigation (unverified): Verify source reliability
- Review disposition: advisory-only; historical aggregate, not a reproduced diagnosis
- Conflicts/limits: No conflicting evidence found Incomplete records required

## Evidence-grounded priorities
- Conduit: 18 recorded clearance failures and six stalled routes. Reproduce reachability failures before proposing geometry changes.
- Rally: six recorded shortcut-timing failures and two camera-relative steering failures. Compare affected source versions; do not assume these still occur.
- Generation/review: recorded schema/protocol failures and contradictory image-review claims warrant targeted validator checks.
- Newer scene experiments: recorded missed short inputs, text repaint artifacts and presentation overrides suggest specific shared-system checks.
- None of these recorded failures proves the latest source still needs the same repair.

## Next audit pass
1. Use factual records to select failing and contrasting examples. Recover originals only when needed.
2. Test the hypothesis before changing a shared catalog, matching rule, capability, or validator.
3. Generate a new candidate through the harness, compare it against the failing and independent cases, and record the result.
4. Promote a hypothesis to a verified lesson only when direct evidence supports it. Preserve contradictions and original deadlines.
