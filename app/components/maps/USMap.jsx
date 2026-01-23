"use client";

import { geoAlbersUsa, geoPath } from "d3-geo";
import { useMemo } from "react";
import {
  FIPS_TO_USPS,
  USPS_TO_FIPS,
  cleanCountyName,
  getCountyId,
  getCountyName,
  getCountyStateFips,
  getStateCodeFromFeature,
  hasAnyCoverageForStateFips,
} from "./mapUtils";
import { COLORS } from "./territories";

export default function USMap({
  states,
  counties,
  territoryIndex,
  hoveredState,
  setHoveredState,
  setHoverTooltip,
  onSelectState,
  width = 1000,
  height = 600,
}) {
  const projection = useMemo(() => {
    if (!states.length) return null;
    return geoAlbersUsa().fitSize([width, height], {
      type: "FeatureCollection",
      features: states,
    });
  }, [states, width, height]);

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

    if (!covered) return COLORS.uncoveredState;
    return hoveredState === code
      ? COLORS.coveredStateHover
      : COLORS.coveredState;
  };

  const getTerritoryForCounty = (countyFeature) => {
    const stateFips = getCountyStateFips(countyFeature);
    if (!stateFips) return null;
    const m = territoryIndex.get(String(stateFips).padStart(2, "0"));
    if (!m) return null;

    const name = cleanCountyName(getCountyName(countyFeature)).toLowerCase();
    return m.get(name) || null;
  };

  const getTerritoryColor = (territory) => {
    if (!territory) return null;
    return COLORS[territory.type] || COLORS.corporate;
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      {/* 1) STATES */}
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
            onClick={() => isCovered && onSelectState(code)}
          />
        );
      })}

      {/* 2) TERRITORY FILLS (counties only that belong to territory) */}
      {path
        ? counties.map((c) => {
            const id = getCountyId(c);
            const d = path(c);
            if (!d) return null;

            const territory = getTerritoryForCounty(c);
            if (!territory) return null;

            const territoryColor = getTerritoryColor(territory);

            return (
              <path
                key={`fill-${id}`}
                d={d}
                fill={territoryColor}
                fillOpacity={0.95}
                stroke={territoryColor}
                strokeWidth={0.6}
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

      {/* 3) STATE LABELS */}
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
