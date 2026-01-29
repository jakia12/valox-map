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

export default function StateTerritoryModal({ stateCode, isOpen, onClose }) {
  const [counties, setCounties] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const width = 900;
  const height = 650;

  const territoryIndex = useMemo(
    () => buildTerritoryIndex(TERRITORIES_BY_STATE),
    [],
  );

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!stateCode) return;

    (async () => {
      const countiesTopo = await loadJson("/maps/us-counties.topo.json");
      const allCounties = topoToFeaturesAuto(countiesTopo, "count");

      const stateFips = String(USPS_TO_FIPS[stateCode]).padStart(2, "0");
      const filtered = allCounties.filter(
        (c) => String(getCountyStateFips(c)).padStart(2, "0") === stateFips,
      );

      setCounties(filtered);
    })().catch(console.error);
  }, [stateCode]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const projection = useMemo(() => {
    if (!counties.length) return null;

    return geoAlbersUsa().fitSize([width, height], {
      type: "FeatureCollection",
      features: counties,
    });
  }, [counties, width, height]);

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

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating && isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop with glassmorphism */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-7xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isAnimating && isOpen
            ? "scale-100 translate-y-0"
            : "scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-linear-to-r from-slate-50 to-white px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {stateCode} Territory Details
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Explore territories and counties
            </p>
          </div>

          <button
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 hover:scale-110"
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
          <div className="p-6">
            {/* MAP - Full Width */}
            <div className="rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-4 shadow-sm">
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
                          opacity={0.95}
                          stroke={fill}
                          strokeWidth={0.8}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      );
                    })
                  : null}

                {/* county borders */}
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
                          stroke="rgba(255,255,255,0.9)"
                          strokeWidth={1.1}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          pointerEvents="none"
                        />
                      );
                    })
                  : null}

                {/* county labels */}
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
                          className="select-none fill-white"
                          style={{
                            fontSize: 9,
                            pointerEvents: "none",
                            opacity: 0.95,
                            fontWeight: 500,
                          }}
                        >
                          {name}
                        </text>
                      );
                    })
                  : null}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
