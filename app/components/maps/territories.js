// app/components/map/territories.js

// FIPS -> USPS
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
  Object.entries(FIPS_TO_USPS).map(([fips, usps]) => [
    usps,
    String(fips).padStart(2, "0"),
  ]),
);

// ✅ Your requested colors
export const COLORS = {
  corporate: "#F2AF58", // yellow
  franchise: "#9B2E2E", // maroon
  green: "#96CB91", // green
};

// ✅ territory.type = "CORPORATE" | "FRANCHISE" | "GREEN"
// We use those types to color everything properly.
export const TERRITORIES_BY_STATE = {
  TX: [
    {
      key: "TX_SAN_ANTONIO",
      label: "San Antonio",
      type: "CORPORATE",
      counties: ["Bexar", "Comal", "Guadalupe", "Wilson", "Atascosa", "Medina"],
    },
    {
      key: "TX_AUSTIN",
      label: "Austin",
      type: "CORPORATE",
      counties: ["Travis", "Williamson", "Hays", "Bastrop", "Caldwell"],
    },
    {
      key: "TX_HOUSTON",
      label: "Houston",
      type: "FRANCHISE",
      counties: ["Harris", "Fort Bend", "Montgomery", "Galveston", "Brazoria"],
    },
    {
      key: "TX_DALLAS",
      label: "Dallas",
      type: "FRANCHISE",
      counties: ["Dallas", "Collin", "Denton", "Rockwall", "Ellis", "Kaufman"],
    },
    {
      key: "TX_FORT_WORTH",
      label: "Fort Worth",
      type: "CORPORATE",
      counties: ["Tarrant", "Parker", "Johnson", "Wise", "Hood"],
    },
  ],

  CA: [
    {
      key: "CA_RIVERSIDE",
      label: "Riverside",
      type: "CORPORATE",
      counties: ["Riverside"],
    },
    {
      key: "CA_LOS_ANGELES",
      label: "Los Angeles",
      type: "CORPORATE",
      counties: ["Los Angeles"],
    },
    {
      key: "CA_SACRAMENTO",
      label: "Sacramento",
      type: "CORPORATE",
      counties: ["Sacramento"],
    },
    {
      key: "CA_SOUTH_BAY",
      label: "South Bay",
      type: "FRANCHISE",
      counties: ["Santa Clara"],
    },
    {
      key: "CA_SAN_DIEGO",
      label: "San Diego",
      type: "FRANCHISE",
      counties: ["San Diego"],
    },
  ],

  MN: [
    {
      key: "MN_MINNEAPOLIS",
      label: "Minneapolis",
      type: "CORPORATE",
      counties: ["Hennepin"],
    },
  ],
  IA: [
    {
      key: "IA_DES_MOINES",
      label: "Des Moines",
      type: "GREEN",
      counties: ["Polk"],
    },
  ],

  MO: [
    {
      key: "MO_KANSAS_CITY",
      label: "Kansas City",
      type: "CORPORATE",
      counties: ["Jackson", "Clay", "Platte", "Cass"],
    },
    {
      key: "MO_ST_LOUIS",
      label: "St. Louis",
      type: "CORPORATE",
      counties: ["St. Louis", "St. Louis City", "St Charles", "Jefferson"],
    },
  ],

  MI: [
    {
      key: "MI_DETROIT",
      label: "Detroit",
      type: "CORPORATE",
      counties: ["Wayne"],
    },
    {
      key: "MI_FLINT",
      label: "Flint",
      type: "CORPORATE",
      counties: ["Genesee"],
    },
  ],

  AL: [
    { key: "AL_DOTHAN", label: "Dothan", type: "GREEN", counties: ["Houston"] },
  ],

  FL: [
    {
      key: "FL_WIREGRASS_COAST",
      label: "Wiregrass Coast",
      type: "CORPORATE",
      counties: [
        "Escambia",
        "Santa Rosa",
        "Okaloosa",
        "Walton",
        "Holmes",
        "Washington",
        "Bay",
        "Jackson",
        "Calhoun",
        "Gulf",
        "Franklin",
        "Gadsden",
        "Liberty",
        "Leon",
        "Wakulla",
        "Jefferson",
        "Madison",
        "Taylor",
        "Dixie",
      ],
    },
    {
      key: "FL_ORLANDO_MIDSTATE",
      label: "Orlando Midstate",
      type: "CORPORATE",
      counties: ["Lake", "Polk", "Orange", "Seminole", "Osceola"],
    },
    {
      key: "FL_FIRST_COAST",
      label: "First Coast",
      type: "FRANCHISE",
      counties: ["Duval", "St. Johns", "Nassau", "Clay"],
    },
    {
      key: "FL_JUPITER",
      label: "Jupiter",
      type: "CORPORATE",
      counties: ["Palm Beach"],
    },
    {
      key: "FL_WEST_PALM",
      label: "West Palm",
      type: "CORPORATE",
      counties: ["Palm Beach"],
    },
    {
      key: "FL_MIAMI_FTL",
      label: "Miami–Ft Lauderdale",
      type: "CORPORATE",
      counties: ["Miami-Dade", "Broward"],
    },
    {
      key: "FL_PORT_ST_LUCIE",
      label: "Port St. Lucie",
      type: "CORPORATE",
      counties: ["St. Lucie"],
    },
    {
      key: "FL_DELAND_DAYTONA",
      label: "DeLand–Daytona",
      type: "CORPORATE",
      counties: ["Volusia"],
    },
  ],

  GA: [
    {
      key: "GA_ATLANTA",
      label: "Atlanta",
      type: "CORPORATE",
      counties: ["Fulton", "DeKalb", "Cobb", "Gwinnett", "Clayton"],
    },
    {
      key: "GA_STONE_MOUNTAIN",
      label: "Stone Mountain",
      type: "CORPORATE",
      counties: ["DeKalb"],
    },
  ],

  SC: [
    { key: "SC_AIKEN", label: "Aiken", type: "FRANCHISE", counties: ["Aiken"] },
    {
      key: "SC_ROCK_HILL",
      label: "Rock Hill",
      type: "CORPORATE",
      counties: ["York"],
    },
  ],

  NC: [
    {
      key: "NC_RDU",
      label: "Raleigh–Durham",
      type: "FRANCHISE",
      counties: ["Wake", "Durham", "Orange"],
    },
    {
      key: "NC_CHARLOTTE",
      label: "Charlotte",
      type: "CORPORATE",
      counties: ["Mecklenburg"],
    },
  ],

  VA: [
    {
      key: "VA_RICHMOND",
      label: "Richmond",
      type: "CORPORATE",
      counties: ["Henrico", "Chesterfield", "Richmond City"],
    },
    {
      key: "VA_NORTHERN",
      label: "Northern VA",
      type: "CORPORATE",
      counties: ["Fairfax", "Arlington", "Loudoun", "Prince William"],
    },
  ],

  MD: [
    {
      key: "MD_ANNAPOLIS",
      label: "Annapolis",
      type: "CORPORATE",
      counties: ["Anne Arundel"],
    },
    {
      key: "MD_FREDERICK",
      label: "Frederick",
      type: "CORPORATE",
      counties: ["Frederick"],
    },
    {
      key: "MD_BALTIMORE",
      label: "Baltimore",
      type: "CORPORATE",
      counties: ["Baltimore", "Baltimore City"],
    },
    {
      key: "MD_METRO",
      label: "Maryland Metro",
      type: "FRANCHISE",
      counties: ["Montgomery", "Prince George's"],
    },
  ],

  IN: [
    {
      key: "IN_ANDERSON",
      label: "Anderson",
      type: "CORPORATE",
      counties: ["Madison"],
    },
    {
      key: "IN_GREENWOOD",
      label: "Greenwood",
      type: "CORPORATE",
      counties: ["Johnson"],
    },
    {
      key: "IN_INDIANAPOLIS",
      label: "Indianapolis",
      type: "FRANCHISE",
      counties: ["Marion", "Hamilton", "Hendricks", "Johnson"],
    },
  ],

  OH: [
    {
      key: "OH_COLUMBUS",
      label: "Columbus",
      type: "CORPORATE",
      counties: ["Franklin", "Delaware", "Licking"],
    },
    {
      key: "OH_AKRON",
      label: "Akron",
      type: "CORPORATE",
      counties: ["Summit"],
    },
    {
      key: "OH_NORWALK",
      label: "Norwalk",
      type: "CORPORATE",
      counties: ["Huron"],
    },
    {
      key: "OH_CLEVELAND",
      label: "Cleveland",
      type: "CORPORATE",
      counties: ["Cuyahoga"],
    },
  ],

  PA: [
    {
      key: "PA_ALLENTOWN",
      label: "Allentown",
      type: "CORPORATE",
      counties: ["Lehigh", "Northampton"],
    },
    {
      key: "PA_PHILADELPHIA",
      label: "Philadelphia",
      type: "CORPORATE",
      counties: ["Philadelphia", "Delaware", "Montgomery", "Bucks", "Chester"],
    },
  ],

  NJ: [
    {
      key: "NJ_WOODBURY",
      label: "Woodbury",
      type: "CORPORATE",
      counties: ["Gloucester"],
    },
    {
      key: "NJ_TOMS_RIVER",
      label: "Toms River",
      type: "CORPORATE",
      counties: ["Ocean"],
    },
    {
      key: "NJ_FREEHOLD",
      label: "Freehold",
      type: "CORPORATE",
      counties: ["Monmouth"],
    },
    {
      key: "NJ_HACKENSACK",
      label: "Hackensack",
      type: "CORPORATE",
      counties: ["Bergen"],
    },
    {
      key: "NJ_MORRISTOWN",
      label: "Morristown",
      type: "CORPORATE",
      counties: ["Morris"],
    },
  ],

  NY: [
    {
      key: "NY_YONKERS",
      label: "Yonkers",
      type: "CORPORATE",
      counties: ["Westchester"],
    },
    {
      key: "NY_LONG_ISLAND",
      label: "Long Island",
      type: "CORPORATE",
      counties: ["Nassau", "Suffolk"],
    },
  ],

  MA: [
    {
      key: "MA_WORCESTER",
      label: "Worcester",
      type: "CORPORATE",
      counties: ["Worcester"],
    },
    {
      key: "MA_PLYMOUTH",
      label: "Plymouth",
      type: "CORPORATE",
      counties: ["Plymouth"],
    },
    {
      key: "MA_BOSTON",
      label: "Boston",
      type: "CORPORATE",
      counties: ["Suffolk", "Middlesex", "Norfolk"],
    },
    {
      key: "MA_TAUNTON",
      label: "Taunton",
      type: "CORPORATE",
      counties: ["Bristol"],
    },
  ],

  AZ: [
    {
      key: "AZ_PHOENIX",
      label: "Phoenix",
      type: "GREEN",
      counties: ["Maricopa"],
    },
    { key: "AZ_TUCSON", label: "Tucson", type: "GREEN", counties: ["Pima"] },
  ],

  CO: [
    {
      key: "CO_DENVER",
      label: "Denver",
      type: "CORPORATE",
      counties: ["Denver", "Arapahoe", "Jefferson", "Adams"],
    },
  ],
  OR: [
    {
      key: "OR_PORTLAND",
      label: "Portland",
      type: "CORPORATE",
      counties: ["Multnomah", "Washington", "Clackamas"],
    },
  ],
  WA: [
    {
      key: "WA_VANCOUVER",
      label: "Vancouver",
      type: "CORPORATE",
      counties: ["Clark"],
    },
  ],
};
export const TERRITORY_COLORS = {
  CORPORATE: "#F2AF58", // yellow
  FRANCHISE: "#9B2E2E", // maroon
  GREEN: "#96CB91", // green
};
// ---------------- helpers ----------------

export function cleanCountyName(n) {
  return String(n)
    .replace(/ County$/i, "")
    .trim();
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

export function territoryColor(t) {
  if (!t) return null;
  if (t.type === "FRANCHISE") return COLORS.franchise;
  if (t.type === "GREEN") return COLORS.green;
  return COLORS.corporate;
}

export function buildTerritoryIndex(territoriesByState) {
  const byState = new Map(); // stateFips -> (countyNameLower -> territory)

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

export async function loadJson(url) {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to load: ${url}`);
  return res.json();
}
