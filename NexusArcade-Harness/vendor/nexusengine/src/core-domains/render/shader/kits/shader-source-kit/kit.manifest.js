import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({ id: "shader-source-kit", responsibility: "Own immutable text or binary Shader source revisions and exact integrity.", domainPath: "n:render:shader", apiName: "renderShaderSources", requires: ["n:render:shader", "render:shader-language"], provides: ["render:shader-source"], module: "./src/core-domains/render/shader/kits/shader-source-kit/index.js", exportName: "createShaderSourceKit", publicSubpath: "./domains/render/shader/source", proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"] });
