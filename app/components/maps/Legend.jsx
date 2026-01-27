"use client";

import { COLORS } from "./territories";

export default function Legend() {
  return (
    <div className="absolute bottom-4 left-5 z-20 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs shadow-md backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ background: COLORS.corporate }}
          />
          <span className="text-slate-700 text-sm">Corporate</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ background: COLORS.franchise }}
          />
          <span className="text-slate-700 text-sm">Franchise</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ background: COLORS.green }}
          />
          <span className="text-slate-700 text-sm">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}
