"use client";

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

function hasAnyCoverageForStateFips(stateFips, territoryIndex) {
  if (!stateFips) return false;
  const m = territoryIndex.get(String(stateFips).padStart(2, "0"));
  return m && m.size > 0;
}

export default function USMapSvg({
  width,
  height,
  states,
  counties,
  path,
  territoryIndex,
  hoveredState,
  setHoveredState,
  setHoverTooltip,
}) {
  const fillForState = (stateFeature) => {
    const code = getStateCodeFromFeature(stateFeature);
    const stateFips = USPS_TO_FIPS[code];
    const covered = stateFips
      ? hasAnyCoverageForStateFips(stateFips, territoryIndex)
      : false;

    if (!covered) return "#88A4BC"; // gray
    return hoveredState === code ? "#3B729F" : "#334155"; // hover
  };

  const getTerritoryForCounty = (countyFeature) => {
    const stateFips = getCountyStateFips(countyFeature);
    if (!stateFips) return null;

    const m = territoryIndex.get(String(stateFips).padStart(2, "0"));
    if (!m) return null;

    const name = cleanCountyName(getCountyName(countyFeature)).toLowerCase();
    return m.get(name) || null;
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      {/* 1) States */}
      {states.map((f, idx) => {
        const code = getStateCodeFromFeature(f);
        const d = path ? path(f) : "";
        if (!d) return null;

        const stateFips = USPS_TO_FIPS[code];
        const isCovered =
          stateFips && hasAnyCoverageForStateFips(stateFips, territoryIndex);

        return (
          <path
            key={`${code}-${idx}`}
            d={d}
            fill={fillForState(f)}
            stroke="#ffffff"
            strokeWidth={1.5}
            className={isCovered ? "cursor-pointer" : "cursor-default"}
            onMouseEnter={() => isCovered && setHoveredState(code)}
            onMouseLeave={() => isCovered && setHoveredState(null)}
          />
        );
      })}

      {/* 2) Territory county fills */}
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

      {/* ✅ 3) County border layer removed بالكامل */}

      {/* 4) State labels */}
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
  );
}
