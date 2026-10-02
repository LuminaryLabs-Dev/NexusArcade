const REQUEST_ID_RE = /^NAB-[0-9]{6}$/;
const GAME_ID_RE = /^NXA-[0-9]{6}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VERSION_RE = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const SHA_RE = /^[a-f0-9]{40}$/;
const REQUIRED_GATES = Object.freeze(["source","build","install","registry","tests","browser","publicUrl"]);

function requireString(value, label, pattern = null) {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(`${label} is required`);
  const normalized = value.trim();
  if (pattern && !pattern.test(normalized)) throw new TypeError(`Invalid ${label}: ${normalized}`);
  return normalized;
}

export function publicArcadeUrl(slug) {
  const safeSlug = requireString(slug, "slug", SLUG_RE);
  return `https://luminarylabs.dev/arcade/${safeSlug}/`;
}

export function createTicketExecution(request, { slug, gameId = request?.gameId || request?.profile?.identity?.gameId || null } = {}) {
  if (!request || typeof request !== "object") throw new TypeError("request is required");
  const requestId = requireString(request.id, "requestId", REQUEST_ID_RE);
  if (!["NEW_GAME","UPDATE_GAME"].includes(request.type)) throw new TypeError(`${requestId}: unsupported request type`);
  const safeSlug = requireString(slug, "slug", SLUG_RE);
  const safeGameId = gameId == null ? null : requireString(gameId, "gameId", GAME_ID_RE);
  if (request.type === "UPDATE_GAME" && !safeGameId) throw new TypeError(`${requestId}: update requests require a gameId`);
  if (request.gameId && safeGameId && request.gameId !== safeGameId) throw new TypeError(`${requestId}: gameId does not match the ticket`);

  return {
    schemaVersion: 1,
    requestId,
    operation: request.type,
    profile: request.profile,
    target: {
      repository: "LuminaryLabs-Dev/NexusArcade-Games",
      gameId: safeGameId,
      slug: safeSlug,
      root: `games/${safeSlug}`,
      source: `games/${safeSlug}/source`,
      build: `games/${safeSlug}/build`,
      install: `games/${safeSlug}/install`,
      publicUrl: publicArcadeUrl(safeSlug),
    },
    requiredGates: [...REQUIRED_GATES],
    readyForImplementation: request.type === "UPDATE_GAME" || Boolean(safeGameId),
  };
}

export function normalizeHarnessCompletion(execution, completion) {
  if (!execution || execution.schemaVersion !== 1) throw new TypeError("execution contract is required");
  if (!completion || typeof completion !== "object") throw new TypeError("completion result is required");
  const gameId = requireString(completion.gameId, "gameId", GAME_ID_RE);
  const slug = requireString(completion.slug, "slug", SLUG_RE);
  const version = requireString(completion.version, "version", VERSION_RE);
  const buildCommit = requireString(completion.buildCommit, "buildCommit", SHA_RE);
  if (slug !== execution.target.slug) throw new TypeError("completion slug does not match execution target");
  if (execution.target.gameId && gameId !== execution.target.gameId) throw new TypeError("completion gameId does not match execution target");

  const publicUrl = new URL(requireString(completion.publicUrl, "publicUrl"));
  if (publicUrl.href !== publicArcadeUrl(slug)) throw new TypeError("completion publicUrl must be the stable Luminary Arcade URL");

  const gates = completion.gates || completion.validation?.gates;
  if (!gates || typeof gates !== "object") throw new TypeError("completion gates are required");
  for (const gate of REQUIRED_GATES) {
    if (gates[gate] !== "PASS") throw new TypeError(`completion gate ${gate} must be PASS`);
  }

  return {
    gameId,
    slug,
    version,
    publicUrl: publicUrl.href,
    buildCommit,
    validation: {
      status: "PASS",
      harness: "NexusArcade-Harness",
      gates: Object.fromEntries(REQUIRED_GATES.map((gate) => [gate, "PASS"])),
      evidence: Array.isArray(completion.evidence || completion.validation?.evidence) ? (completion.evidence || completion.validation.evidence).filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim()) : [],
      checkedAt: typeof (completion.checkedAt || completion.validation?.checkedAt) === "string" && (completion.checkedAt || completion.validation?.checkedAt) ? (completion.checkedAt || completion.validation.checkedAt) : new Date().toISOString(),
    },
  };
}

export const TICKET_REQUIRED_GATES = REQUIRED_GATES;
