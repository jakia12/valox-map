"use client";

import Legend from "./Legend";
import UsaTerritoryMap from "./UsaTerritoryMap";

export default function MapShell() {
  return (
    <div className="relative">
      <UsaTerritoryMap />
      <Legend />
    </div>
  );
}
