"use client";

import { COLORS } from "./territories";

export default function Legend() {
  return (
    <div className="absolute bottom-4 left-4 z-20 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs shadow-md backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ background: COLORS.corporate }}
          />
          <span className="text-slate-700">Corporate</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ background: COLORS.franchise }}
          />
          <span className="text-slate-700">Franchise</span>
        </div>
      </div>
    </div>
  );
}
