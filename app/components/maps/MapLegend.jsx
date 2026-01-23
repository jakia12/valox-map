"use client";

import { COLORS } from "./territories";

export default function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <div className="flex items-center gap-3">
        <LegendItem label="Corporate" color={COLORS.corporate} shape="dot" />
        <LegendItem label="Franchise" color={COLORS.franchise} shape="dot" />
        <LegendItem label="Green" color={COLORS.green} shape="dot" />
      </div>

      <div className="mt-2 flex items-center gap-2 text-slate-600">
        <span
          className="inline-block h-3 w-3 rounded-sm"
          style={{ background: COLORS.coveredState }}
        />
        <span>Coverage in State</span>
      </div>
    </div>
  );
}

function LegendItem({ label, color, shape }) {
  return (
    <div className="flex items-center gap-2">
      {shape === "dot" ? (
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ background: color }}
        />
      ) : (
        <span
          className="inline-block h-3 w-3 rounded-sm"
          style={{ background: color }}
        />
      )}
      <span className="text-slate-700">{label}</span>
    </div>
  );
}
