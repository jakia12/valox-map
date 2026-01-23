"use client";

import { geoMercator, geoPath } from "d3-geo";
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

export default function StateTerritoryDetail({ stateCode, onBack }) {
  const [counties, setCounties] = useState([]);

  const width = 900;
  const height = 650;

  const territoryIndex = useMemo(
    () => buildTerritoryIndex(TERRITORIES_BY_STATE),
    [],
  );

  useEffect(() => {
    (async () => {
      const countiesTopo = await loadJson("/maps/us-counties.topo.json");
      const allCounties = topoToFeaturesAuto(countiesTopo, "count");

      const stateFips = USPS_TO_FIPS[stateCode];
      const filtered = allCounties.filter(
        (c) => String(getCountyStateFips(c)).padStart(2, "0") === stateFips,
      );

      setCounties(filtered);
    })().catch(console.error);
  }, [stateCode]);

  const projection = useMemo(() => {
    if (!counties.length) return null;

    return geoMercator().fitSize([width, height], {
      type: "FeatureCollection",
      features: counties,
    });
  }, [counties]);

  const path = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection],
  );

  const getTerritoryForCounty = (countyFeature) => {
    const stateFips = getCountyStateFips(countyFeature);
    if (!stateFips) return null;

    const m = territoryIndex.get(String(stateFips).padStart(2, "0"));
    if (!m) return null;

    const name = cleanCountyName(getCountyName(countyFeature)).toLowerCase();
    return m.get(name) || null;
  };

  const territoriesForState = useMemo(() => {
    return TERRITORIES_BY_STATE[stateCode] || [];
  }, [stateCode]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">
          {stateCode} — Territory Detail
        </div>

        <button
          onClick={onBack}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-12">
        {/* MAP */}
        <div className="lg:col-span-10 rounded-xl border border-slate-200 bg-white p-3">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
            {/* fills */}
            {path
              ? counties.map((c) => {
                  const id = getCountyId(c);
                  const d = path(c);
                  if (!d) return null;

                  const territory = getTerritoryForCounty(c);
                  const fill = territory
                    ? territoryColor(territory)
                    : "#88A4BC";

                  return (
                    <path
                      key={`fill-${id}`}
                      d={d}
                      fill={fill}
                      fillOpacity={0.95}
                    />
                  );
                })
              : null}

            {/* ✅ county borders ONLY here */}
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
                      stroke="#ffffff"
                      strokeWidth={1.2}
                      opacity={0.95}
                      pointerEvents="none"
                    />
                  );
                })
              : null}

            {/* optional county labels (simple) */}
            {path
              ? counties.map((c) => {
                  const d = path(c);
                  if (!d) return null;
                  const [x, y] = path.centroid(c);
                  const name = cleanCountyName(getCountyName(c));
                  if (!name) return null;

                  return (
                    <text
                      key={`label-${getCountyId(c)}`}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="select-none fill-white font-regular"
                      style={{
                        fontSize: 7,
                        pointerEvents: "none",
                        opacity: 0.95,
                      }}
                    >
                      {name}
                    </text>
                  );
                })
              : null}
          </svg>
        </div>

        {/* SIDE LIST */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-sm font-semibold text-slate-900">
            Territories
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Click “Back” to return to USA map.
          </div>

          <div className="mt-3 space-y-2">
            {territoriesForState.length ? (
              territoriesForState.map((t) => {
                const color = t.type === "FRANCHISE" ? "#9B2E2E" : "#F2AF58";

                return (
                  <div
                    key={t.key}
                    className="rounded-xl border border-slate-200 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <div className="text-sm font-semibold text-slate-900">
                        {t.label}
                      </div>
                    </div>

                    <div className="mt-1 text-[11px] text-slate-700">
                      <span className="font-normal text-slate-600">
                        Counties: {t.counties.join(", ")}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="mt-3 text-sm text-slate-600">
                No territories for this state.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
