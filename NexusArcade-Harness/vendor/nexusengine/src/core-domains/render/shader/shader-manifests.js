import shaderContract from "./kits/shader-contract-kit/kit.manifest.js";
import shaderLanguage from "./kits/shader-language-kit/kit.manifest.js";
import shaderSource from "./kits/shader-source-kit/kit.manifest.js";
import shaderInclude from "./kits/shader-include-kit/kit.manifest.js";
import shaderModule from "./kits/shader-module-kit/kit.manifest.js";
import shaderProgram from "./kits/shader-program-kit/kit.manifest.js";
import shaderVariant from "./kits/shader-variant-kit/kit.manifest.js";
import shaderPermutation from "./kits/shader-permutation-kit/kit.manifest.js";
import shaderError from "./kits/shader-error-kit/kit.manifest.js";
import shaderCompile from "./kits/shader-compile-kit/kit.manifest.js";
import shaderReflection from "./kits/shader-reflection-kit/kit.manifest.js";
import shaderCache from "./kits/shader-cache-kit/kit.manifest.js";

export const RENDER_SHADER_KIT_MANIFESTS = Object.freeze([
  shaderContract,
  shaderLanguage,
  shaderSource,
  shaderInclude,
  shaderModule,
  shaderProgram,
  shaderVariant,
  shaderPermutation,
  shaderError,
  shaderCompile,
  shaderReflection,
  shaderCache
]);
