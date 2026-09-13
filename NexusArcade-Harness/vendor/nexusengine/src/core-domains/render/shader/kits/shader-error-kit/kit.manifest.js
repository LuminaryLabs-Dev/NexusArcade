import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({ id: "shader-error-kit", responsibility: "Normalize portable Shader diagnostics without owning compiler execution or repair.", domainPath: "n:render:shader", apiName: "renderShaderErrors", requires: ["n:render:shader"], provides: ["render:shader-error"], module: "./src/core-domains/render/shader/kits/shader-error-kit/index.js", exportName: "createShaderErrorKit", publicSubpath: "./domains/render/shader/error", proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"] });
