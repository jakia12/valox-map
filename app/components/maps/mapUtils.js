import { feature } from "topojson-client";

export const FIPS_TO_USPS = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  10: "DE",
  11: "DC",
  12: "FL",
  13: "GA",
  15: "HI",
  16: "ID",
  17: "IL",
  18: "IN",
  19: "IA",
  20: "KS",
  21: "KY",
  22: "LA",
  23: "ME",
  24: "MD",
  25: "MA",
  26: "MI",
  27: "MN",
  28: "MS",
  29: "MO",
  30: "MT",
  31: "NE",
  32: "NV",
  33: "NH",
  34: "NJ",
  35: "NM",
  36: "NY",
  37: "NC",
  38: "ND",
  39: "OH",
  40: "OK",
  41: "OR",
  42: "PA",
  44: "RI",
  45: "SC",
  46: "SD",
  47: "TN",
  48: "TX",
  49: "UT",
  50: "VT",
  51: "VA",
  53: "WA",
  54: "WV",
  55: "WI",
  56: "WY",
};

export const USPS_TO_FIPS = Object.fromEntries(
  Object.entries(FIPS_TO_USPS).map(([fips, usps]) => [usps, fips]),
);

export async function loadJson(url) {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to load: ${url}`);
  return res.json();
}

export function topoToFeaturesAuto(topo, preferContains) {
  const names = Object.keys(topo.objects || {});
  if (!names.length) throw new Error("TopoJSON has no objects");

  const chosen =
    names.find((n) =>
      n.toLowerCase().includes(String(preferContains).toLowerCase()),
    ) || names[0];

  const fc = feature(topo, topo.objects[chosen]);
  return { objectName: chosen, features: fc.features || [] };
}

export function getStateCodeFromFeature(f) {
  const code =
    f?.properties?.STUSPS ||
    f?.properties?.postal ||
    f?.properties?.abbr ||
    null;

  if (code) return String(code);

  const statefpRaw = f?.properties?.STATEFP ?? f?.id ?? "";
  const statefp = String(statefpRaw).padStart(2, "0");
  return FIPS_TO_USPS[statefp] || statefp;
}

export function getCountyId(f) {
  return String(f?.properties?.GEOID ?? f?.properties?.geoid ?? f?.id ?? "");
}

export function getCountyStateFips(f) {
  const p = f?.properties || {};
  const v =
    p.STATEFP ??
    p.statefp ??
    p.STATE ??
    p.state ??
    p.STATE_FIPS ??
    p.state_fips ??
    null;

  if (v != null) return String(v).padStart(2, "0");

  const geoid = String(p.GEOID ?? p.geoid ?? f?.id ?? "");
  if (geoid.length >= 2) return geoid.slice(0, 2);

  return null;
}

export function getCountyName(f) {
  const p = f?.properties || {};
  return p.NAME || p.name || p.NAMELSAD || p.county || p.COUNTY || "";
}

export function cleanCountyName(n) {
  return String(n)
    .replace(/ County$/i, "")
    .trim();
}

export function buildTerritoryIndex(territoriesByState) {
  const byState = new Map(); // stateFips -> Map(countyNameLower -> territory)

  for (const [usps, territories] of Object.entries(territoriesByState)) {
    const fips = USPS_TO_FIPS[usps];
    if (!fips) continue;

    const m = new Map();
    for (const t of territories) {
      for (const c of t.counties) {
        m.set(String(c).trim().toLowerCase(), t);
      }
    }
    byState.set(String(fips).padStart(2, "0"), m);
  }

  return byState;
}

export function hasAnyCoverageForStateFips(stateFips, territoryIndex) {
  if (!stateFips) return false;
  const m = territoryIndex.get(String(stateFips).padStart(2, "0"));
  return m && m.size > 0;
}
