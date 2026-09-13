import subdomain0 from "./source/subdomain.manifest.js";
import subdomain1 from "./analysis/subdomain.manifest.js";
import subdomain2 from "./ir/subdomain.manifest.js";
import subdomain3 from "./classification/subdomain.manifest.js";
import subdomain4 from "./orchestration/subdomain.manifest.js";
import subdomain5 from "./compile/subdomain.manifest.js";
import subdomain6 from "./toolchain/subdomain.manifest.js";
import subdomain7 from "./target/subdomain.manifest.js";
import subdomain8 from "./artifact/subdomain.manifest.js";
import subdomain9 from "./proof/subdomain.manifest.js";
import subdomain10 from "./target/web-live/subdomain.manifest.js";
import subdomain11 from "./target/web-static/subdomain.manifest.js";
import subdomain12 from "./target/openxr/subdomain.manifest.js";
import subdomain13 from "./target/android-xr/subdomain.manifest.js";
import subdomain14 from "./target/pcvr/subdomain.manifest.js";

export const BUILD_SUBDOMAIN_MANIFESTS = Object.freeze([
  subdomain0,
  subdomain1,
  subdomain2,
  subdomain3,
  subdomain4,
  subdomain5,
  subdomain6,
  subdomain7,
  subdomain8,
  subdomain9,
  subdomain10,
  subdomain11,
  subdomain12,
  subdomain13,
  subdomain14
]);

export const BUILD_SUBDOMAIN_PUBLIC_ENTRIES = Object.freeze([
  { domainPath: "n:build:source", subpath: "./domains/build/source", module: "./src/core-domains/build/source/index.js" },
  { domainPath: "n:build:analysis", subpath: "./domains/build/analysis", module: "./src/core-domains/build/analysis/index.js" },
  { domainPath: "n:build:ir", subpath: "./domains/build/ir", module: "./src/core-domains/build/ir/index.js" },
  { domainPath: "n:build:classification", subpath: "./domains/build/classification", module: "./src/core-domains/build/classification/index.js" },
  { domainPath: "n:build:orchestration", subpath: "./domains/build/orchestration", module: "./src/core-domains/build/orchestration/index.js" },
  { domainPath: "n:build:compile", subpath: "./domains/build/compile", module: "./src/core-domains/build/compile/index.js" },
  { domainPath: "n:build:toolchain", subpath: "./domains/build/toolchain", module: "./src/core-domains/build/toolchain/index.js" },
  { domainPath: "n:build:target", subpath: "./domains/build/target", module: "./src/core-domains/build/target/index.js" },
  { domainPath: "n:build:artifact", subpath: "./domains/build/artifact", module: "./src/core-domains/build/artifact/index.js" },
  { domainPath: "n:build:proof", subpath: "./domains/build/proof", module: "./src/core-domains/build/proof/index.js" },
  { domainPath: "n:build:target:web-live", subpath: "./domains/build/target/web-live", module: "./src/core-domains/build/target/web-live/index.js" },
  { domainPath: "n:build:target:web-static", subpath: "./domains/build/target/web-static", module: "./src/core-domains/build/target/web-static/index.js" },
  { domainPath: "n:build:target:openxr", subpath: "./domains/build/target/openxr", module: "./src/core-domains/build/target/openxr/index.js" },
  { domainPath: "n:build:target:android-xr", subpath: "./domains/build/target/android-xr", module: "./src/core-domains/build/target/android-xr/index.js" },
  { domainPath: "n:build:target:pcvr", subpath: "./domains/build/target/pcvr", module: "./src/core-domains/build/target/pcvr/index.js" }
]);
