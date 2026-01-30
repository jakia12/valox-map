"use client";

import { geoAlbersUsa, geoPath } from "d3-geo";
import { useEffect, useMemo, useState } from "react";
import { feature } from "topojson-client";

import StateTerritoryModal from "./StateTerritoryModal";
import {
  TERRITORIES_BY_STATE,
  USPS_TO_FIPS,
  buildTerritoryIndex,
  cleanCountyName,
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

export default function UsaTerritoryMap() {
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);

  const [hoveredState, setHoveredState] = useState(null);

  // ✅ territory hover (for neon inside shape)
  const [hoveredTerritoryKey, setHoveredTerritoryKey] = useState(null);

  // ✅ tooltip
  const [hoverTooltip, setHoverTooltip] = useState(null);

  // ✅ modal state
  const [selectedState, setSelectedState] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
      <div className="w-full">
        <div className="relative overflow-hidden bg-white ">
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
            {/* SVG Filter for territory outlines */}
            <defs>
              <filter
                id="territoryOutline"
                x="-10%"
                y="-10%"
                width="120%"
                height="120%"
              >
                <feMorphology
                  operator="dilate"
                  radius="5"
                  radius="1.2"
                  in="SourceAlpha"
                  result="expanded"
                />
                <feFlood
                  floodColor="#ffffff"
                  floodOpacity="0.8"
                  result="outlineColor"
                />
                <feComposite
                  in="outlineColor"
                  in2="expanded"
                  operator="in"
                  result="outline"
                />
                <feMerge>
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

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
                  strokeWidth={2}
                  className={isCovered ? "cursor-pointer" : "cursor-default"}
                  onMouseEnter={() => isCovered && setHoveredState(code)}
                  onMouseLeave={() => isCovered && setHoveredState(null)}
                  onClick={() => {
                    if (!isCovered) return;
                    setSelectedState(code);
                    setIsModalOpen(true);
                  }}
                />
              );
            })}

            {/* 2) TERRITORY FILLS - Grouped by territory with unified outlines */}
            {path
              ? (() => {
                  // Group counties by territory
                  const territoryGroups = new Map();

                  counties.forEach((c) => {
                    const territory = getTerritoryForCounty(c);
                    if (!territory) return;

                    if (!territoryGroups.has(territory.key)) {
                      territoryGroups.set(territory.key, {
                        territory,
                        counties: [],
                      });
                    }
                    territoryGroups.get(territory.key).counties.push(c);
                  });

                  // Lighter version of #F2AF58 for outer border
                  const outerBorderColor = "#F8D9A8";

                  // Render each territory as a group with unified outline
                  return Array.from(territoryGroups.values()).map(
                    ({ territory, counties: terrCounties }) => {
                      const base = territoryColor(territory) || territory.color;
                      const isHovered = hoveredTerritoryKey === territory.key;
                      const neonFill = "#FACC15";

                      // Merge all county paths into one for the territory
                      const mergedPath = terrCounties
                        .map((c) => path(c))
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <g key={`territory-group-${territory.key}`}>
                          {/* Outer border - drawn first */}
                          <path
                            d={mergedPath}
                            fill="none"
                            stroke={isHovered ? "#E89F2D" : outerBorderColor}
                            strokeWidth={7}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                            pointerEvents="none"
                            style={{
                              transition: "stroke 140ms ease",
                            }}
                          />

                          {/* Territory fill - single merged path with no inner borders */}
                          <path
                            d={mergedPath}
                            fill={isHovered ? neonFill : base}
                            fillOpacity={isHovered ? 1 : 0.97}
                            stroke="none"
                            className="cursor-pointer"
                            style={{
                              transition: "fill 140ms ease, opacity 140ms ease",
                            }}
                            onMouseEnter={(e) => {
                              setHoveredTerritoryKey(territory.key);

                              const rect =
                                e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                              if (!rect) return;

                              setHoverTooltip({
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top,
                                title: `${territory.label}`,
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
                              if (territory.url) {
                                window.location.href = territory.url;
                              }
                            }}
                          />
                        </g>
                      );
                    },
                  );
                })()
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
                  style={{ fontSize: 10, pointerEvents: "none", opacity: 0.9 }}
                >
                  {code}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Modal */}
      <StateTerritoryModal
        stateCode={selectedState}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedState(null);
        }}
      />
    </>
  );
}
