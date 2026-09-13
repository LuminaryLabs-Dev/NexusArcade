import navigation from "./navigation/subdomain.manifest.js";
import navmesh from "./navigation/navmesh/subdomain.manifest.js";
import pathfinding from "./navigation/pathfinding/subdomain.manifest.js";
import routeField from "./navigation/route-field/subdomain.manifest.js";
import landmarkGuidance from "./navigation/landmark-guidance/subdomain.manifest.js";
import generation from "./generation/subdomain.manifest.js";
import terrain from "./terrain/subdomain.manifest.js";
import waterSurface from "./water-surface/subdomain.manifest.js";
import navmeshKit from "./navigation/navmesh/kits/navmesh-kit/kit.manifest.js";
import pathfindingKit from "./navigation/pathfinding/kits/pathfinding-kit/kit.manifest.js";
import routeFieldKit from "./navigation/route-field/kits/route-field-kit/kit.manifest.js";
import landmarkGuidanceKit from "./navigation/landmark-guidance/kits/landmark-guidance-kit/kit.manifest.js";
import proceduralGenerationKit from "./generation/kits/procedural-generation-kit/kit.manifest.js";
import terrainKit from "./terrain/kits/terrain-kit/kit.manifest.js";
import waterSurfaceKit from "./water-surface/kits/water-surface-kit/kit.manifest.js";

export const RESTORED_WORLD_SUBDOMAINS = Object.freeze([navigation, navmesh, pathfinding, routeField, landmarkGuidance, generation, terrain, waterSurface]);
export const RESTORED_WORLD_KITS = Object.freeze([navmeshKit, pathfindingKit, routeFieldKit, landmarkGuidanceKit, proceduralGenerationKit, terrainKit, waterSurfaceKit]);
export const RESTORED_WORLD_PUBLIC_ENTRIES = Object.freeze([{ domainPath: "n:world:navigation", subpath: "./domains/world/navigation", module: "./src/core-domains/world/navigation/index.js" }]);
