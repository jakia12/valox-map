import { feature } from "topojson-client";

export function topoToFeatures(topo) {
  const objectNames = Object.keys(topo.objects || {});
  if (!objectNames.length) {
    throw new Error("TopoJSON has no objects");
  }

  // pick first object in file (common case)
  const objectName = objectNames[0];
  const fc = feature(topo, topo.objects[objectName]);

  return {
    objectName,
    features: fc.features,
  };
}
