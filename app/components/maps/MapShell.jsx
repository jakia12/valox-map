"use client";

import { geoAlbersUsa, geoPath } from "d3-geo";
import { useEffect, useMemo, useState } from "react";
import { feature } from "topojson-client";

// FIPS -> USPS
const FIPS_TO_USPS = {
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

const USPS_TO_FIPS = Object.fromEntries(
  Object.entries(FIPS_TO_USPS).map(([fips, usps]) => [usps, fips]),
);

async function loadJson(url) {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to load: ${url}`);
  return res.json();
}

function topoToFeaturesAuto(topo, preferContains) {
  const names = Object.keys(topo.objects || {});
  if (!names.length) throw new Error("TopoJSON has no objects");

  const chosen =
    names.find((n) =>
      n.toLowerCase().includes(String(preferContains).toLowerCase()),
    ) || names[0];

  const fc = feature(topo, topo.objects[chosen]);
  return { objectName: chosen, features: fc.features || [] };
}

function getStateCodeFromFeature(f) {
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

function getCountyId(f) {
  return String(f?.properties?.GEOID ?? f?.properties?.geoid ?? f?.id ?? "");
}

function getCountyStateFips(f) {
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

function getCountyName(f) {
  const p = f?.properties || {};
  return p.NAME || p.name || p.NAMELSAD || p.county || p.COUNTY || "";
}

function cleanCountyName(n) {
  return String(n)
    .replace(/ County$/i, "")
    .trim();
}

/**
 * TERRITORIES (your data)
 * Each territory = list of counties. Expand anytime.
 */
const TERRITORIES_BY_STATE = {
  TX: [
    {
      key: "TX_SAN_ANTONIO",
      label: "San Antonio",
      color: "#2563EB",
      counties: ["Bexar", "Comal", "Guadalupe", "Wilson", "Atascosa", "Medina"],
    },
    {
      key: "TX_AUSTIN",
      label: "Austin",
      color: "#F97316",
      counties: ["Travis", "Williamson", "Hays", "Bastrop", "Caldwell"],
    },
    {
      key: "TX_HOUSTON",
      label: "Houston",
      color: "#22C55E",
      counties: ["Harris", "Fort Bend", "Montgomery", "Galveston", "Brazoria"],
    },
    {
      key: "TX_DALLAS",
      label: "Dallas",
      color: "#EF4444",
      counties: ["Dallas", "Collin", "Denton", "Rockwall", "Ellis", "Kaufman"],
    },
    {
      key: "TX_FORT_WORTH",
      label: "Fort Worth",
      color: "#A855F7",
      counties: ["Tarrant", "Parker", "Johnson", "Wise", "Hood"],
    },
  ],
  CA: [
    {
      key: "CA_SAN_DIEGO",
      label: "San Diego",
      color: "#2563EB",
      counties: ["San Diego"],
    },
    {
      key: "CA_RIVERSIDE",
      label: "Riverside",
      color: "#F97316",
      counties: ["Riverside"],
    },
    {
      key: "CA_LOS_ANGELES",
      label: "Los Angeles",
      color: "#EF4444",
      counties: ["Los Angeles"],
    },
    {
      key: "CA_SOUTH_BAY",
      label: "South Bay",
      color: "#22C55E",
      counties: ["Santa Clara"],
    },
    {
      key: "CA_SACRAMENTO",
      label: "Sacramento",
      color: "#A855F7",
      counties: ["Sacramento"],
    },
  ],
  MN: [
    {
      key: "MN_MINNEAPOLIS",
      label: "Minneapolis",
      color: "#2563EB",
      counties: ["Hennepin"],
    },
  ],
  IA: [
    {
      key: "IA_DES_MOINES",
      label: "Des Moines",
      color: "#2563EB",
      counties: ["Polk"],
    },
  ],
  MO: [
    {
      key: "MO_KANSAS_CITY",
      label: "Kansas City",
      color: "#F97316",
      counties: ["Jackson", "Clay", "Platte", "Cass"],
    },
    {
      key: "MO_ST_LOUIS",
      label: "St. Louis",
      color: "#EF4444",
      counties: ["St. Louis", "St. Louis City", "St Charles", "Jefferson"],
    },
  ],
  MI: [
    {
      key: "MI_DETROIT",
      label: "Detroit",
      color: "#2563EB",
      counties: ["Wayne"],
    },
    {
      key: "MI_FLINT",
      label: "Flint",
      color: "#F97316",
      counties: ["Genesee"],
    },
  ],
  AL: [
    {
      key: "AL_DOTHAN",
      label: "Dothan",
      color: "#2563EB",
      counties: ["Houston"],
    },
  ],
  FL: [
    {
      key: "FL_PENSACOLA",
      label: "Pensacola",
      color: "#2563EB",
      counties: ["Escambia"],
    },
    {
      key: "FL_FIRST_COAST",
      label: "First Coast",
      color: "#F97316",
      counties: ["Duval", "St Johns", "Nassau", "Clay"],
    },
    {
      key: "FL_DELAND_DAYTONA",
      label: "DeLand–Daytona",
      color: "#22C55E",
      counties: ["Volusia"],
    },
    {
      key: "FL_ORLANDO",
      label: "Orlando",
      color: "#EF4444",
      counties: ["Orange", "Seminole", "Osceola"],
    },
    {
      key: "FL_PORT_ST_LUCIE",
      label: "Port St. Lucie",
      color: "#A855F7",
      counties: ["St. Lucie"],
    },
    {
      key: "FL_JUPITER",
      label: "Jupiter",
      color: "#0EA5E9",
      counties: ["Palm Beach"],
    },
    {
      key: "FL_WEST_PALM",
      label: "West Palm",
      color: "#84CC16",
      counties: ["Palm Beach"],
    },
    {
      key: "FL_MIAMI_FTL",
      label: "Miami–Ft Lauderdale",
      color: "#FB7185",
      counties: ["Miami-Dade", "Broward"],
    },
  ],
  GA: [
    {
      key: "GA_ATLANTA",
      label: "Atlanta",
      color: "#2563EB",
      counties: ["Fulton", "DeKalb", "Cobb", "Gwinnett", "Clayton"],
    },
    {
      key: "GA_STONE_MOUNTAIN",
      label: "Stone Mountain",
      color: "#F97316",
      counties: ["DeKalb"],
    },
  ],
  SC: [
    { key: "SC_AIKEN", label: "Aiken", color: "#2563EB", counties: ["Aiken"] },
    {
      key: "SC_ROCK_HILL",
      label: "Rock Hill",
      color: "#F97316",
      counties: ["York"],
    },
  ],
  NC: [
    {
      key: "NC_RDU",
      label: "Raleigh–Durham",
      color: "#2563EB",
      counties: ["Wake", "Durham", "Orange"],
    },
    {
      key: "NC_CHARLOTTE",
      label: "Charlotte",
      color: "#F97316",
      counties: ["Mecklenburg"],
    },
  ],
  VA: [
    {
      key: "VA_RICHMOND",
      label: "Richmond",
      color: "#2563EB",
      counties: ["Henrico", "Chesterfield", "Richmond City"],
    },
    {
      key: "VA_NORTHERN",
      label: "Northern VA",
      color: "#F97316",
      counties: ["Fairfax", "Arlington", "Loudoun", "Prince William"],
    },
  ],
  MD: [
    {
      key: "MD_ANNAPOLIS",
      label: "Annapolis",
      color: "#2563EB",
      counties: ["Anne Arundel"],
    },
    {
      key: "MD_FREDERICK",
      label: "Frederick",
      color: "#F97316",
      counties: ["Frederick"],
    },
    {
      key: "MD_BALTIMORE",
      label: "Baltimore",
      color: "#22C55E",
      counties: ["Baltimore", "Baltimore City"],
    },
    {
      key: "MD_METRO",
      label: "Maryland Metro",
      color: "#EF4444",
      counties: ["Montgomery", "Prince George's"],
    },
  ],
  IN: [
    {
      key: "IN_ANDERSON",
      label: "Anderson",
      color: "#2563EB",
      counties: ["Madison"],
    },
    {
      key: "IN_INDIANAPOLIS",
      label: "Indianapolis",
      color: "#F97316",
      counties: ["Marion", "Hamilton", "Hendricks", "Johnson"],
    },
    {
      key: "IN_GREENWOOD",
      label: "Greenwood",
      color: "#22C55E",
      counties: ["Johnson"],
    },
  ],
  OH: [
    {
      key: "OH_COLUMBUS",
      label: "Columbus",
      color: "#2563EB",
      counties: ["Franklin", "Delaware", "Licking"],
    },
    { key: "OH_AKRON", label: "Akron", color: "#F97316", counties: ["Summit"] },
    {
      key: "OH_NORWALK",
      label: "Norwalk",
      color: "#22C55E",
      counties: ["Huron"],
    },
    {
      key: "OH_CLEVELAND",
      label: "Cleveland",
      color: "#EF4444",
      counties: ["Cuyahoga"],
    },
  ],
  PA: [
    {
      key: "PA_ALLENTOWN",
      label: "Allentown",
      color: "#2563EB",
      counties: ["Lehigh", "Northampton"],
    },
    {
      key: "PA_PHILADELPHIA",
      label: "Philadelphia",
      color: "#F97316",
      counties: ["Philadelphia", "Delaware", "Montgomery", "Bucks", "Chester"],
    },
  ],
  NJ: [
    {
      key: "NJ_WOODBURY",
      label: "Woodbury",
      color: "#2563EB",
      counties: ["Gloucester"],
    },
    {
      key: "NJ_TOMS_RIVER",
      label: "Toms River",
      color: "#F97316",
      counties: ["Ocean"],
    },
    {
      key: "NJ_FREEHOLD",
      label: "Freehold",
      color: "#22C55E",
      counties: ["Monmouth"],
    },
    {
      key: "NJ_HACKENSACK",
      label: "Hackensack",
      color: "#EF4444",
      counties: ["Bergen"],
    },
    {
      key: "NJ_MORRISTOWN",
      label: "Morristown",
      color: "#A855F7",
      counties: ["Morris"],
    },
  ],
  NY: [
    {
      key: "NY_YONKERS",
      label: "Yonkers",
      color: "#2563EB",
      counties: ["Westchester"],
    },
    {
      key: "NY_LONG_ISLAND",
      label: "Long Island",
      color: "#F97316",
      counties: ["Nassau", "Suffolk"],
    },
  ],
  MA: [
    {
      key: "MA_WORCESTER",
      label: "Worcester",
      color: "#2563EB",
      counties: ["Worcester"],
    },
    {
      key: "MA_PLYMOUTH",
      label: "Plymouth",
      color: "#F97316",
      counties: ["Plymouth"],
    },
    {
      key: "MA_BOSTON",
      label: "Boston",
      color: "#22C55E",
      counties: ["Suffolk", "Middlesex", "Norfolk"],
    },
    {
      key: "MA_TAUNTON",
      label: "Taunton",
      color: "#EF4444",
      counties: ["Bristol"],
    },
  ],
  AZ: [
    {
      key: "AZ_PHOENIX",
      label: "Phoenix",
      color: "#2563EB",
      counties: ["Maricopa"],
    },
    { key: "AZ_TUCSON", label: "Tucson", color: "#F97316", counties: ["Pima"] },
  ],
  CO: [
    {
      key: "CO_DENVER",
      label: "Denver",
      color: "#2563EB",
      counties: ["Denver", "Arapahoe", "Jefferson", "Adams"],
    },
  ],
  OR: [
    {
      key: "OR_PORTLAND",
      label: "Portland",
      color: "#2563EB",
      counties: ["Multnomah", "Washington", "Clackamas"],
    },
  ],
  WA: [
    {
      key: "WA_VANCOUVER",
      label: "Vancouver",
      color: "#2563EB",
      counties: ["Clark"],
    },
  ],
};

function buildTerritoryIndex(territoriesByState) {
  // stateFips -> (countyNameLower -> territory)
  const byState = new Map();

  for (const [usps, territories] of Object.entries(territoriesByState)) {
    const fips = USPS_TO_FIPS[usps];
    if (!fips) continue;

    const m = new Map();
    for (const t of territories) {
      for (const c of t.counties) {
        m.set(String(c).trim().toLowerCase(), t);
      }
    }
    byState.set(fips, m);
  }

  return byState;
}

function hasAnyCoverageForStateFips(stateFips, territoryIndex) {
  const m = territoryIndex.get(stateFips);
  return m && m.size > 0;
}

export default function MapShell() {
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [hoveredState, setHoveredState] = useState(null);
  const [hoverTooltip, setHoverTooltip] = useState(null);

  const width = 1000;
  const height = 600;

  useEffect(() => {
    (async () => {
      const [statesTopo, countiesTopo] = await Promise.all([
        loadJson("/maps/us-states.topo.json"),
        loadJson("/maps/us-counties.topo.json"),
      ]);

      const s = topoToFeaturesAuto(statesTopo, "states");
      const c = topoToFeaturesAuto(countiesTopo, "count");

      setStates(s.features || []);
      setCounties(c.features || []);
    })().catch(console.error);
  }, []);

  const projection = useMemo(() => {
    if (!states.length) return null;
    return geoAlbersUsa().fitSize([width, height], {
      type: "FeatureCollection",
      features: states,
    });
  }, [states]);

  const path = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection],
  );

  const territoryIndex = useMemo(
    () => buildTerritoryIndex(TERRITORIES_BY_STATE),
    [],
  );

  // ✅ State fill theme: NO hover for gray states
  const fillForState = (stateFeature) => {
    const code = getStateCodeFromFeature(stateFeature);
    const stateFips = USPS_TO_FIPS[code];
    const covered = stateFips
      ? hasAnyCoverageForStateFips(stateFips, territoryIndex)
      : false;

    if (!covered) return "#88A4BC"; // light gray (no hover)
    return hoveredState === code ? "#3B729F" : "#334155"; // covered states hover
  };

  // Determine territory for a county feature
  const getTerritoryForCounty = (countyFeature) => {
    const stateFips = getCountyStateFips(countyFeature);
    if (!stateFips) return null;
    const m = territoryIndex.get(stateFips);
    if (!m) return null;

    const name = cleanCountyName(getCountyName(countyFeature)).toLowerCase();
    return m.get(name) || null;
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden bg-white">
        {/* Tooltip (HTML overlay) */}
        {hoverTooltip ? (
          <div
            className="pointer-events-none absolute z-10 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur"
            style={{
              left: hoverTooltip.x,
              top: hoverTooltip.y,
              transform: "translate(10px, 10px)",
              maxWidth: 240,
            }}
          >
            <div className="font-semibold text-slate-900 text-sm">
              {hoverTooltip.title}
            </div>
            <div className="mt-0.5 font-medium text-slate-800 text-sm">
              Click for Details
            </div>
            {hoverTooltip.subtitle ? (
              <div className="mt-0.5 text-slate-600 text-sm">
                {hoverTooltip.subtitle}
              </div>
            ) : null}
          </div>
        ) : null}

        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
          {/* ===== 1) States ===== */}
          {states.map((f, idx) => {
            const code = getStateCodeFromFeature(f);

            const d = path ? path(f) : "";
            if (!d) return null;

            const stateFips = USPS_TO_FIPS[code];
            const isCovered =
              stateFips &&
              hasAnyCoverageForStateFips(stateFips, territoryIndex);

            return (
              <path
                key={`${code}-${idx}`}
                d={d}
                fill={fillForState(f)}
                stroke="#ffffff"
                strokeWidth={1.5}
                className={isCovered ? "cursor-pointer" : "cursor-default"}
                onMouseEnter={() => {
                  if (isCovered) setHoveredState(code);
                }}
                onMouseLeave={() => {
                  if (isCovered) setHoveredState(null);
                }}
              />
            );
          })}

          {/* ===== 2) Territory fills (only counties that belong to a territory) ===== */}
          {path
            ? counties.map((c) => {
                const id = getCountyId(c);
                const d = path(c);
                if (!d) return null;

                const territory = getTerritoryForCounty(c);
                if (!territory) return null;

                return (
                  <path
                    key={`fill-${id}`}
                    d={d}
                    fill={territory.color}
                    fillOpacity={0.88}
                    stroke="transparent"
                    className="cursor-pointer"
                    onMouseEnter={(e) => {
                      const rect =
                        e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (!rect) return;

                      const countyName = cleanCountyName(getCountyName(c));
                      const stateFips = getCountyStateFips(c);
                      const usps =
                        stateFips &&
                        FIPS_TO_USPS[String(stateFips).padStart(2, "0")]
                          ? FIPS_TO_USPS[String(stateFips).padStart(2, "0")]
                          : "";

                      setHoverTooltip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        title: usps
                          ? `${territory.label}, ${usps}`
                          : territory.label,
                        subtitle: countyName ? `${countyName} County` : "",
                      });
                    }}
                    onMouseMove={(e) => {
                      const rect =
                        e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (!rect) return;

                      setHoverTooltip((t) =>
                        t
                          ? {
                              ...t,
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            }
                          : t,
                      );
                    }}
                    onMouseLeave={() => setHoverTooltip(null)}
                  />
                );
              })
            : null}

          {/* ===== 3) ALL county borders (thin) ===== */}
          {path
            ? counties.map((c) => {
                const id = getCountyId(c);
                const d = path(c);
                if (!d) return null;

                return (
                  <path
                    key={`border-${id}`}
                    d={d}
                    fill="transparent"
                    stroke="#0B1220"
                    strokeWidth={0.55}
                    opacity={0.75}
                    pointerEvents="none"
                  />
                );
              })
            : null}

          {/* ===== 4) State labels ===== */}
          {states.map((f, idx) => {
            const code = getStateCodeFromFeature(f);

            const d = path ? path(f) : "";
            if (!d) return null;

            const [x, y] = path.centroid(f);

            return (
              <text
                key={`label-${code}-${idx}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="select-none fill-white font-semibold"
                style={{ fontSize: 12, pointerEvents: "none", opacity: 0.9 }}
              >
                {code}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
