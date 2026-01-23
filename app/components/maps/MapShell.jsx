"use client";

import { useState } from "react";
import Legend from "./Legend";
import StateTerritoryDetail from "./StateTerritoryDetail";
import UsaTerritoryMap from "./UsaTerritoryMap";

export default function MapShell() {
  const [selectedState, setSelectedState] = useState(null);

  if (selectedState) {
    return (
      <StateTerritoryDetail
        stateCode={selectedState}
        onBack={() => setSelectedState(null)}
      />
    );
  }

  return (
    <div className="relative">
      <UsaTerritoryMap onSelectState={(code) => setSelectedState(code)} />
      <Legend />
    </div>
  );
}
