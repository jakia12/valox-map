"use client";

import { geoAlbersUsa, geoPath } from "d3-geo";
import { useEffect, useMemo, useState } from "react";
import { feature } from "topojson-client";

import {
  TERRITORIES_BY_STATE,
  USPS_TO_FIPS,
  buildTerritoryIndex,
  cleanCountyName,
  getCountyId,
  getCountyName,
  getCountyStateFips,
  getStateCodeFromFeature,
  hasAnyCoverageForStateFips,
  loadJson,
  territoryColor,
} from "./territories";

function topoToFeaturesAuto(topo, preferContains) {
  const names = Object.keys(topo.objects || {});
  const chosen =
    names.find((n) =>
      n.toLowerCase().includes(String(preferContains).toLowerCase()),
    ) || names[0];

  const fc = feature(topo, topo.objects[chosen]);
  return fc.features || [];
}

// Small helper: brighten hex color (for neon hover)
function brightenHex(hex, amount = 0.22) {
  // hex like "#RRGGBB"
  const h = String(hex || "").replace("#", "");
  if (h.length !== 6) return hex;

  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);

  const mix = (v) => Math.round(v + (255 - v) * amount);

  const rr = mix(r).toString(16).padStart(2, "0");
  const gg = mix(g).toString(16).padStart(2, "0");
  const bb = mix(b).toString(16).padStart(2, "0");

  return `#${rr}${gg}${bb}`;
}

export default function UsaTerritoryMap({ onSelectState }) {
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);

  const [hoveredState, setHoveredState] = useState(null);

  // ✅ territory hover (for neon inside shape)
  const [hoveredTerritoryKey, setHoveredTerritoryKey] = useState(null);

  // ✅ tooltip
  const [hoverTooltip, setHoverTooltip] = useState(null);

  const width = 1000;
  const height = 600;

  useEffect(() => {
    (async () => {
      const [statesTopo, countiesTopo] = await Promise.all([
        loadJson("/maps/us-states.topo.json"),
        loadJson("/maps/us-counties.topo.json"),
      ]);

      setStates(topoToFeaturesAuto(statesTopo, "state"));
      setCounties(topoToFeaturesAuto(countiesTopo, "count"));
    })().catch(console.error);
  }, []);

  const territoryIndex = useMemo(
    () => buildTerritoryIndex(TERRITORIES_BY_STATE),
    [],
  );

  // ✅ remove AK from main map
  const filteredStates = useMemo(() => {
    return states.filter((f) => getStateCodeFromFeature(f) !== "AK");
  }, [states]);

  const projection = useMemo(() => {
    if (!filteredStates.length) return null;
    return geoAlbersUsa().fitSize([width, height], {
      type: "FeatureCollection",
      features: filteredStates,
    });
  }, [filteredStates]);

  const path = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection],
  );

  const fillForState = (stateFeature) => {
    const code = getStateCodeFromFeature(stateFeature);
    const stateFips = USPS_TO_FIPS[code];

    const covered = stateFips
      ? hasAnyCoverageForStateFips(stateFips, territoryIndex)
      : false;

    if (!covered) return "#88A4BC"; // light map states
    return hoveredState === code ? "#3B729F" : "#334155"; // covered states
  };

  const getTerritoryForCounty = (countyFeature) => {
    const stateFips = getCountyStateFips(countyFeature);
    if (!stateFips) return null;

    const m = territoryIndex.get(String(stateFips).padStart(2, "0"));
    if (!m) return null;

    const name = cleanCountyName(getCountyName(countyFeature)).toLowerCase();
    return m.get(name) || null;
  };
  function darkenHex(hex, amount = 0.2) {
    const h = String(hex || "").replace("#", "");
    if (h.length !== 6) return hex;

    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);

    const mix = (v) => Math.round(v * (1 - amount));

    return `#${mix(r).toString(16).padStart(2, "0")}${mix(g)
      .toString(16)
      .padStart(2, "0")}${mix(b).toString(16).padStart(2, "0")}`;
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden bg-white">
        {/* Tooltip */}
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
          </div>
        ) : null}

        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
          {/* 1) STATES */}
          {filteredStates.map((f, idx) => {
            const code = getStateCodeFromFeature(f);
            const d = path ? path(f) : "";
            if (!d) return null;

            const stateFips = USPS_TO_FIPS[code];
            const isCovered =
              stateFips &&
              hasAnyCoverageForStateFips(
                String(stateFips).padStart(2, "0"),
                territoryIndex,
              );

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
                onClick={() => {
                  if (!isCovered) return;
                  onSelectState?.(code);
                }}
              />
            );
          })}

          {/* 2) TERRITORY FILLS (NO county borders, no seams, neon inside hover) */}
          {path
            ? counties.map((c) => {
                const id = getCountyId(c);
                const d = path(c);
                if (!d) return null;

                const territory = getTerritoryForCounty(c);
                if (!territory) return null;

                // base color from your logic (should return #F2AF58 or #9B2E2E or #96CB91)
                const base = territoryColor(territory) || territory.color;

                const isHovered = hoveredTerritoryKey === territory.key;

                // neon INSIDE region (no outside glow)

                const neonFill = "#FACC15";
                const neonStroke = "#FACC15";

                return (
                  <path
                    key={`fill-${id}`}
                    d={d}
                    fill={isHovered ? neonFill : base}
                    fillOpacity={isHovered ? 1 : 0.97}
                    /*
                      ✅ THIS removes the tiny seam lines:
                      - stroke matches fill so edges "seal" together
                      - strokeWidth is tiny but enough to cover anti-alias cracks
                      - on hover, stroke becomes neon for a crisp highlighted edge
                    */
                    stroke={isHovered ? neonStroke : base}
                    strokeWidth={isHovered ? 1.6 : 0.9}
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    shapeRendering="geometricPrecision"
                    className="cursor-pointer"
                    style={{
                      transition:
                        "fill 140ms ease, stroke 140ms ease, stroke-width 140ms ease, opacity 140ms ease",
                    }}
                    onMouseEnter={(e) => {
                      setHoveredTerritoryKey(territory.key);

                      const rect =
                        e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (!rect) return;

                      setHoverTooltip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        title: `${territory.label} Area`,
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
                    onMouseLeave={() => {
                      setHoveredTerritoryKey(null);
                      setHoverTooltip(null);
                    }}
                    onClick={() => {
                      // keep your existing behavior
                      // e.g. open detail panel for that territory/state if you want
                    }}
                  />
                );
              })
            : null}

          {/* 3) STATE LABELS */}
          {filteredStates.map((f, idx) => {
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
