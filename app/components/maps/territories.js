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
      url: "https://veloxval.com/service-areas/texas/san-antonio/",
    },
    {
      key: "TX_AUSTIN",
      label: "Austin",
      type: "CORPORATE",
      counties: ["Travis", "Williamson", "Hays", "Bastrop", "Caldwell"],
      url: "https://veloxval.com/service-areas/texas/austin/",
    },
    {
      key: "TX_HOUSTON",
      label: "Houston",
      type: "FRANCHISE",
      counties: ["Harris", "Fort Bend", "Montgomery", "Galveston", "Brazoria"],
      url: "https://veloxval.com/service-areas/texas/houston/",
    },
    {
      key: "TX_DALLAS",
      label: "Dallas",
      type: "FRANCHISE",
      counties: ["Dallas", "Collin", "Denton", "Rockwall", "Ellis", "Kaufman"],
      url: "https://veloxval.com/service-areas/texas/dallas/",
    },
    {
      key: "TX_FORT_WORTH",
      label: "Fort Worth",
      type: "CORPORATE",
      counties: ["Tarrant", "Parker", "Johnson", "Wise", "Hood"],
      url: "https://veloxval.com/service-areas/texas/forth-worth/",
    },
  ],

  CA: [
    {
      key: "CA_RIVERSIDE",
      label: "Riverside",
      type: "CORPORATE",
      counties: ["Riverside"],
      url: "https://veloxval.com/service-areas/california/riverside/",
    },
    {
      key: "CA_LOS_ANGELES",
      label: "Los Angeles",
      type: "CORPORATE",
      counties: ["Los Angeles"],
      url: "https://veloxval.com/service-areas/california/los-angeles/",
    },
    {
      key: "CA_SACRAMENTO",
      label: "Sacramento",
      type: "CORPORATE",
      counties: ["Sacramento"],
      url: "https://veloxval.com/service-areas/california/sacramento/",
    },
    {
      key: "CA_SOUTH_BAY",
      label: "South Bay",
      type: "FRANCHISE",
      counties: ["Santa Clara"],
      url: "https://veloxval.com/service-areas/california/south-bay/",
    },
    {
      key: "CA_SAN_DIEGO",
      label: "San Diego",
      type: "FRANCHISE",
      counties: ["San Diego"],
      url: "https://veloxval.com/service-areas/california/san-diego/",
    },
  ],

  MN: [
    {
      key: "MN_MINNEAPOLIS",
      label: "Minneapolis",
      type: "CORPORATE",
      counties: ["Hennepin"],
      url: "https://veloxval.com/order-an-appraisal/",
    },
  ],
  IA: [
    {
      key: "IA_DES_MOINES",
      label: "Des Moines",
      type: "GREEN",
      counties: ["Polk"],
      url: "https://veloxval.com/careers/",
    },
  ],

  MO: [
    {
      key: "MO_KANSAS_CITY",
      label: "Kansas City",
      type: "CORPORATE",
      counties: ["Jackson", "Clay", "Platte", "Cass"],
      url: "https://veloxval.com/service-areas/missouri/kansas-city/",
    },
    {
      key: "MO_ST_LOUIS",
      label: "St. Louis",
      type: "CORPORATE",
      counties: ["St. Louis", "St. Louis City", "St Charles", "Jefferson"],
      url: "https://veloxval.com/service-areas/missouri/st-louis/",
    },
  ],

  MI: [
    {
      key: "MI_DETROIT",
      label: "Detroit",
      type: "CORPORATE",
      counties: ["Wayne"],
      url: "https://veloxval.com/service-areas/michigan/detroit/",
    },
    {
      key: "MI_FLINT",
      label: "Flint",
      type: "CORPORATE",
      counties: ["Genesee"],
      url: "https://veloxval.com/service-areas/michigan/flint/",
    },
  ],

  AL: [],

  FL: [
    {
      key: "FL_WIREGRASS_COAST",
      label: "Wiregrass Coast",
      type: "FRANCHISE",
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
      url: "https://veloxval.com/service-areas/florida/wiregrass-coast/",
    },
    {
      key: "FL_ORLANDO",
      label: "Orlando",
      type: "FRANCHISE",
      counties: ["Lake", "Polk", "Orange", "Osceola"],
      url: "https://veloxval.com/service-areas/florida/orlando/",
    },
    {
      key: "FL_FIRST_COAST",
      label: "First Coast",
      type: "FRANCHISE",
      counties: [
        "Duval",
        "St. Johns",
        "Nassau",
        "Clay",
        "Volusia",
        "Flagler",
        "Seminole",
      ],
      url: "https://veloxval.com/service-areas/florida/firstcoast/",
    },
    {
      key: "FL_JUPITER",
      label: "Jupiter",
      type: "CORPORATE",
      counties: ["Palm Beach"],
      url: "https://veloxval.com/service-areas/florida/jupiter/",
    },
    {
      key: "FL_WEST_PALM_BEACH",
      label: "West Palm Beach",
      type: "CORPORATE",
      counties: ["Martin"],
      url: "https://veloxval.com/service-areas/florida/west-palm-beach/",
    },
    {
      key: "FL_MIAMI_LAUDERDALE",
      label: "Miami-Lauderdale",
      type: "CORPORATE",
      counties: ["Miami-Dade", "Broward"],
      url: "https://veloxval.com/service-areas/florida/miami-lauderdale/",
    },
    {
      key: "FL_PORT_ST_LUCIE",
      label: "Port St. Lucie",
      type: "CORPORATE",
      counties: ["St. Lucie"],
      url: "https://veloxval.com/service-areas/florida/port-st-lucie/",
    },
    {
      key: "FL_CLEARWATER",
      label: "Clearwater",
      type: "CORPORATE",
      counties: ["Pinellas"],
      url: "https://veloxval.com/service-areas/florida/clearwater/",
    },
    {
      key: "FL_TAMPA",
      label: "Tampa",
      type: "CORPORATE",
      counties: ["Hillsborough"],
      url: "https://veloxval.com/service-areas/florida/tampa/",
    },
    {
      key: "FL_SARASOTA",
      label: "Sarasota",
      type: "CORPORATE",
      counties: ["Sarasota"],
      url: "https://veloxval.com/service-areas/florida/sarasota/",
    },
    {
      key: "FL_DELAND",
      label: "DeLand",
      type: "CORPORATE",
      counties: ["Volusia"],
      url: "https://veloxval.com/service-areas/florida/deland/",
    },
  ],

  GA: [
    {
      key: "GA_ATLANTA",
      label: "Atlanta",
      type: "CORPORATE",
      counties: ["Fulton", "DeKalb", "Cobb", "Gwinnett", "Clayton"],
      url: "https://veloxval.com/service-areas/georgia/atlanta/",
    },
    {
      key: "GA_STONE_MOUNTAIN",
      label: "Stone Mountain",
      type: "CORPORATE",
      counties: ["DeKalb"],
      url: "https://veloxval.com/service-areas/georgia/stone-mountain/",
    },
  ],

  SC: [
    {
      key: "SC_AALC_REGION",
      label: "AALC Region",
      type: "FRANCHISE",
      counties: ["Aiken"],
      url: "https://veloxval.com/service-areas/south-carolina/aalc-region/",
    },
    {
      key: "SC_ROCK_HILL",
      label: "Rock Hill",
      type: "CORPORATE",
      counties: ["York"],
      url: "https://veloxval.com/service-areas/south-carolina/rock-hill/",
    },
  ],

  NC: [
    {
      key: "NC_RDU",
      label: "Raleigh–Durham",
      type: "FRANCHISE",
      counties: ["Wake", "Durham", "Orange"],
      url: "https://veloxval.com/service-areas/north-carolina/raleigh-durham/",
    },
    {
      key: "NC_CHARLOTTE",
      label: "Charlotte",
      type: "CORPORATE",
      counties: ["Mecklenburg"],
      url: "https://veloxval.com/service-areas/north-carolina/charlotte/",
    },
  ],

  VA: [
    {
      key: "VA_RICHMOND",
      label: "Richmond",
      type: "CORPORATE",
      counties: ["Henrico", "Chesterfield", "Richmond City"],
      url: "https://veloxval.com/service-areas/virginia/richmond/",
    },
    {
      key: "VA_NORTHERN",
      label: "Northern VA",
      type: "CORPORATE",
      counties: ["Fairfax", "Arlington", "Loudoun", "Prince William"],
      url: "https://veloxval.com/service-areas/virginia/northern/",
    },
  ],

  MD: [
    {
      key: "MD_ANNAPOLIS",
      label: "Annapolis",
      type: "CORPORATE",
      counties: ["Anne Arundel"],
      url: "https://veloxval.com/service-areas/maryland/annapolis/",
    },
    {
      key: "MD_FREDERICK",
      label: "Frederick",
      type: "CORPORATE",
      counties: ["Frederick"],
      url: "https://veloxval.com/service-areas/maryland/frederick/",
    },
    {
      key: "MD_BALTIMORE",
      label: "Baltimore",
      type: "CORPORATE",
      counties: ["Baltimore", "Baltimore City"],
      url: "https://veloxval.com/service-areas/maryland/baltimore/",
    },
    {
      key: "MD_METRO",
      label: "Maryland Metro",
      type: "FRANCHISE",
      counties: ["Montgomery", "Prince George's"],
      url: "https://veloxval.com/service-areas/maryland/maryland-metro/",
    },
  ],

  IN: [
    {
      key: "IN_ANDERSON",
      label: "Anderson",
      type: "CORPORATE",
      counties: ["Madison"],
      url: "https://veloxval.com/service-areas/indiana/anderson/",
    },
    {
      key: "IN_GREENWOOD",
      label: "Greenwood",
      type: "CORPORATE",
      counties: ["Johnson"],
      url: "https://veloxval.com/service-areas/indiana/greenwood/",
    },
    {
      key: "IN_INDIANAPOLIS",
      label: "Indianapolis",
      type: "FRANCHISE",
      counties: ["Marion", "Hamilton", "Hendricks", "Johnson"],
      url: "https://veloxval.com/service-areas/indiana/indianapolis/",
    },
  ],

  OH: [
    {
      key: "OH_COLUMBUS",
      label: "Columbus",
      type: "CORPORATE",
      counties: ["Franklin", "Delaware", "Licking"],
      url: "https://veloxval.com/service-areas/ohio/columbus/",
    },
    {
      key: "OH_AKRON",
      label: "Akron",
      type: "CORPORATE",
      counties: ["Summit"],
      url: "https://veloxval.com/service-areas/ohio/akron/",
    },
    {
      key: "OH_NORWALK",
      label: "Norwalk",
      type: "CORPORATE",
      counties: ["Huron"],
      url: "https://veloxval.com/service-areas/ohio/norwalk/",
    },
    {
      key: "OH_CLEVELAND",
      label: "Cleveland",
      type: "CORPORATE",
      counties: ["Cuyahoga"],
      url: "https://veloxval.com/service-areas/ohio/cleveland/",
    },
  ],

  PA: [
    {
      key: "PA_ALLENTOWN",
      label: "Allentown",
      type: "CORPORATE",
      counties: ["Lehigh", "Northampton"],
      url: "https://veloxval.com/service-areas/pennsylvania/allentown/",
    },
    {
      key: "PA_PHILADELPHIA",
      label: "Philadelphia",
      type: "CORPORATE",
      counties: ["Philadelphia", "Delaware", "Montgomery", "Bucks", "Chester"],
      url: "https://veloxval.com/service-areas/pennsylvania/philadelphia/",
    },
  ],

  NJ: [
    {
      key: "NJ_WOODBURY",
      label: "Woodbury",
      type: "CORPORATE",
      counties: ["Gloucester"],
      url: "https://veloxval.com/service-areas/new-jersey/woodbury/",
    },
    {
      key: "NJ_TOMS_RIVER",
      label: "Toms River",
      type: "CORPORATE",
      counties: ["Ocean"],
      url: "https://veloxval.com/service-areas/new-jersey/toms-river/",
    },
    {
      key: "NJ_FREEHOLD",
      label: "Freehold",
      type: "CORPORATE",
      counties: ["Monmouth"],
      url: "https://veloxval.com/service-areas/new-jersey/freehold/",
    },
    {
      key: "NJ_HACKENSACK",
      label: "Hackensack",
      type: "CORPORATE",
      counties: ["Bergen"],
      url: "https://veloxval.com/service-areas/new-jersey/hackensack/",
    },
    {
      key: "NJ_MORRISTOWN",
      label: "Morristown",
      type: "CORPORATE",
      counties: ["Morris"],
      url: "https://veloxval.com/service-areas/new-jersey/morristown/",
    },
  ],

  NY: [
    {
      key: "NY_YONKERS",
      label: "Yonkers",
      type: "CORPORATE",
      counties: ["Westchester"],
      url: "https://veloxval.com/service-areas/new-york/yonkers/",
    },
    {
      key: "NY_LONG_ISLAND",
      label: "Long Island",
      type: "CORPORATE",
      counties: ["Nassau", "Suffolk"],
      url: "https://veloxval.com/service-areas/new-york/long-island/",
    },
  ],

  MA: [
    {
      key: "MA_WORCESTER",
      label: "Worcester",
      type: "CORPORATE",
      counties: ["Worcester"],
      url: "https://veloxval.com/service-areas/massachusetts/worcester/",
    },
    {
      key: "MA_PLYMOUTH",
      label: "Plymouth",
      type: "CORPORATE",
      counties: ["Plymouth"],
      url: "https://veloxval.com/service-areas/massachusetts/plymouth/",
    },
    {
      key: "MA_BOSTON",
      label: "Boston",
      type: "CORPORATE",
      counties: ["Suffolk", "Middlesex", "Norfolk"],
      url: "https://veloxval.com/service-areas/massachusetts/boston/",
    },
    {
      key: "MA_TAUNTON",
      label: "Taunton",
      type: "CORPORATE",
      counties: ["Bristol"],
      url: "https://veloxval.com/service-areas/massachusetts/taunton/",
    },
  ],

  CT: [
    {
      key: "CT_HARTFORD",
      label: "Hartford",
      type: "CORPORATE",
      counties: ["Hartford"],
      url: "https://veloxval.com/service-areas/connecticut/hartford/",
    },
  ],

  AZ: [
    {
      key: "AZ_PHOENIX",
      label: "Phoenix",
      type: "GREEN",
      counties: ["Maricopa"],
      url: "https://veloxval.com/service-areas/arizona/pheonix/",
    },
    {
      key: "AZ_TUCSON",
      label: "Tucson",
      type: "GREEN",
      counties: ["Pima"],
      url: "https://veloxval.com/service-areas/arizona/tucson/",
    },
  ],

  CO: [
    {
      key: "CO_DENVER",
      label: "Denver",
      type: "CORPORATE",
      counties: ["Denver", "Arapahoe", "Jefferson", "Adams"],
      url: "https://veloxval.com/service-areas/colorado/denver/",
    },
  ],
  OR: [
    {
      key: "OR_PORTLAND",
      label: "Portland",
      type: "CORPORATE",
      counties: ["Multnomah", "Washington", "Clackamas"],
      url: "https://veloxval.com/service-areas/oregon/portland/",
    },
  ],
  WA: [
    {
      key: "WA_VANCOUVER",
      label: "Vancouver",
      type: "CORPORATE",
      counties: ["Clark"],
      url: "https://veloxval.com/service-areas/washington/vancouver/",
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
