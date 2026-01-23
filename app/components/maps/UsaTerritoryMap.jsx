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

export default function UsaTerritoryMap({ onSelectState }) {
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

      setStates(topoToFeaturesAuto(statesTopo, "state"));
      setCounties(topoToFeaturesAuto(countiesTopo, "count"));
    })().catch(console.error);
  }, []);

  const territoryIndex = useMemo(
    () => buildTerritoryIndex(TERRITORIES_BY_STATE),
    [],
  );

  const filteredStates = useMemo(() => {
    // ✅ remove AK from main map
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

    if (!covered) return "#88A4BC"; // gray state
    return hoveredState === code ? "#3B729F" : "#334155"; // covered state
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
            {hoverTooltip.subtitle ? (
              <div className="mt-0.5 text-slate-600 text-sm">
                {hoverTooltip.subtitle}
              </div>
            ) : null}
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

          {/* 2) TERRITORY FILLS (with subtle separation stroke) */}
          {path
            ? counties.map((c) => {
                const id = getCountyId(c);
                const d = path(c);
                if (!d) return null;

                const territory = getTerritoryForCounty(c);
                if (!territory) return null;

                const color = territoryColor(territory);

                return (
                  <path
                    key={`fill-${id}`}
                    d={d}
                    fill={color}
                    fillOpacity={0.95}
                    stroke="rgba(255,255,255,0.65)" // ✅ subtle separation so same colors don’t merge
                    strokeWidth={0.85}
                    strokeLinejoin="round"
                    className="cursor-pointer"
                    onMouseEnter={(e) => {
                      const rect =
                        e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (!rect) return;

                      const countyName = cleanCountyName(getCountyName(c));
                      setHoverTooltip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        title: territory.label,
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
