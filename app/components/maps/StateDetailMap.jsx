"use client";

import { geoMercator, geoPath } from "d3-geo";
import { useMemo, useState } from "react";
import {
  USPS_TO_FIPS,
  cleanCountyName,
  getCountyName,
  getCountyStateFips,
  getStateCodeFromFeature,
} from "./mapUtils";
import { COLORS } from "./territories";

export default function StateDetailMap({
  stateCode,
  states,
  counties,
  territoryIndex,
  territoriesByState,
  onBack,
  width = 900,
  height = 650,
}) {
  const [tip, setTip] = useState(null);

  const stateFeature = useMemo(() => {
    return states.find((s) => getStateCodeFromFeature(s) === stateCode) || null;
  }, [states, stateCode]);

  const stateFips = USPS_TO_FIPS[stateCode];

  const stateCounties = useMemo(() => {
    if (!stateFips) return [];
    return counties.filter(
      (c) => getCountyStateFips(c) === String(stateFips).padStart(2, "0"),
    );
  }, [counties, stateFips]);

  // Use mercator + fitSize style behavior by fitting to the state's counties bounding box
  const projection = useMemo(() => {
    if (!stateCounties.length) return null;

    // Mercator works great for single-state zoom/detail maps
    const p = geoMercator();
    const path = geoPath(p);

    // Fit to counties (more accurate than state outline for labels)
    const fc = { type: "FeatureCollection", features: stateCounties };
    const b = path.bounds(fc);
    const dx = b[1][0] - b[0][0];
    const dy = b[1][1] - b[0][1];

    const scale = 0.95 / Math.max(dx / width, dy / height);
    const tx = width / 2 - (scale * (b[0][0] + b[1][0])) / 2;
    const ty = height / 2 - (scale * (b[0][1] + b[1][1])) / 2;

    return p.scale(scale).translate([tx, ty]);
  }, [stateCounties, width, height]);

  const path = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection],
  );

  const m = territoryIndex.get(String(stateFips).padStart(2, "0"));
  const territories = territoriesByState[stateCode] || [];

  const territoryColor = (t) => COLORS[t.type] || COLORS.corporate;

  // Map county name -> county feature (for marker dots)
  const countyByName = useMemo(() => {
    const map = new Map();
    for (const c of stateCounties) {
      map.set(cleanCountyName(getCountyName(c)).toLowerCase(), c);
    }
    return map;
  }, [stateCounties]);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {/* LEFT: map */}
      <div className="lg:col-span-8 relative rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="font-semibold text-slate-900">
            {stateCode} — Territory Detail
          </div>
          <button
            onClick={onBack}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>
        </div>

        {/* Tooltip */}
        {tip ? (
          <div
            className="pointer-events-none absolute z-10 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur"
            style={{
              left: tip.x,
              top: tip.y,
              transform: "translate(10px, 10px)",
              maxWidth: 260,
            }}
          >
            <div className="font-semibold text-slate-900 text-sm">
              {tip.title}
            </div>
            {tip.subtitle ? (
              <div className="mt-0.5 text-slate-600 text-sm">
                {tip.subtitle}
              </div>
            ) : null}
          </div>
        ) : null}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Counties fill base */}
          {path
            ? stateCounties.map((c, i) => {
                const d = path(c);
                if (!d) return null;

                // territory fill if belongs
                const countyName = cleanCountyName(
                  getCountyName(c),
                ).toLowerCase();
                const t = m?.get(countyName) || null;

                return (
                  <path
                    key={`c-fill-${i}`}
                    d={d}
                    fill={t ? territoryColor(t) : COLORS.uncoveredState}
                    fillOpacity={t ? 0.95 : 1}
                    stroke="#ffffff"
                    strokeWidth={1.2}
                  />
                );
              })
            : null}

          {/* County labels */}
          {path
            ? stateCounties.map((c, i) => {
                const d = path(c);
                if (!d) return null;

                const [x, y] = path.centroid(c);
                const name = cleanCountyName(getCountyName(c));
                if (!name) return null;

                return (
                  <text
                    key={`c-label-${i}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="select-none fill-white font-semibold"
                    style={{
                      fontSize: 14,
                      pointerEvents: "none",
                      opacity: 0.95,
                    }}
                  >
                    {name}
                  </text>
                );
              })
            : null}

          {/* Territory marker dots (like your AZ screenshot) */}
          {path
            ? territories.map((t) => {
                const markerCountyName = String(
                  t.counties?.[0] || "",
                ).toLowerCase();
                const c = countyByName.get(markerCountyName);
                if (!c) return null;

                const [x, y] = path.centroid(c);
                const color = territoryColor(t);

                return (
                  <circle
                    key={`dot-${t.key}`}
                    cx={x}
                    cy={y}
                    r={10}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={3}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      const rect =
                        e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (!rect) return;

                      setTip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        title: t.label,
                        subtitle: `${t.type.toUpperCase()} • ${t.counties.join(", ")}`,
                      });
                    }}
                    onMouseMove={(e) => {
                      const rect =
                        e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (!rect) return;

                      setTip((prev) =>
                        prev
                          ? {
                              ...prev,
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            }
                          : prev,
                      );
                    }}
                    onMouseLeave={() => setTip(null)}
                  />
                );
              })
            : null}
        </svg>
      </div>

      {/* RIGHT: list */}
      <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="font-semibold text-slate-900">Territories</div>
          <div className="text-sm text-slate-600 mt-1">
            Click “Back” to return to USA map.
          </div>
        </div>

        <div className="p-4 space-y-3">
          {territories.map((t) => (
            <div key={t.key} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: territoryColor(t) }}
                />
                <div className="font-semibold text-slate-900">{t.label}</div>
              </div>

              <div className="mt-1 text-xs text-slate-600">
                <span className="font-medium text-slate-700">
                  {t.type.toUpperCase()}
                </span>{" "}
                • Counties: {t.counties.join(", ")}
              </div>
            </div>
          ))}
          {!territories.length ? (
            <div className="text-sm text-slate-600">
              No territories found for this state.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
