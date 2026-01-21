"use client";

import { geoCentroid } from "d3-geo";
import { useEffect, useMemo, useState } from "react";

export function HoverRegionsOverlay({
  projection,
  states,
  hoveredStateId,
  width,
  height,
}) {
  const [regionsByState, setRegionsByState] = useState({});

  useEffect(() => {
    (async () => {
      const res = await fetch("/maps/state-regions.json");
      const json = await res.json();
      setRegionsByState(json || {});
    })();
  }, []);

  const activeRegions =
    hoveredStateId && regionsByState[hoveredStateId]?.regions
      ? regionsByState[hoveredStateId].regions
      : [];

  const stateFeature = useMemo(() => {
    if (!hoveredStateId) return null;
    return states.find((s) => String(s.id) === String(hoveredStateId)) || null;
  }, [states, hoveredStateId]);

  const centroidXY = useMemo(() => {
    if (!projection || !stateFeature) return null;
    const [lon, lat] = geoCentroid(stateFeature);
    return projection([lon, lat]);
  }, [projection, stateFeature]);

  if (!projection || !hoveredStateId || !activeRegions.length || !centroidXY)
    return null;

  const [cx, cy] = centroidXY;

  const lineH = 16;
  const boxW = 260;
  const boxH = Math.min(180, activeRegions.length * lineH + 12);

  const baseX = cx; // tweak later
  const baseY = cy; // tweak later

  return (
    <g>
      <rect
        x={baseX - 2}
        y={baseY - lineH - 6}
        width={boxW}
        height={boxH}
        rx={10}
        fill="rgba(255,255,255,0.85)"
        stroke="rgba(226,232,240,1)"
      />

      {activeRegions.slice(0, 10).map((r, i) => (
        <a key={r.name} href={r.url}>
          <text
            x={baseX + 8}
            y={baseY + i * lineH}
            fontSize="12"
            fontWeight="600"
            fill="#0f172a"
            style={{
              opacity: 0,
              transform: `translateY(6px)`,
              animation: `fadeUp 160ms ease-out ${i * 18}ms forwards`,
              cursor: "pointer",
            }}
          >
            {r.name}
          </text>
        </a>
      ))}

      <style>{`
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0px); }
        }
      `}</style>
    </g>
  );
}
