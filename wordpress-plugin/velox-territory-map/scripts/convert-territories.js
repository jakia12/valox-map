// Script to convert territories.js to territories.json
// Run this with: node convert-territories.js

const fs = require("fs");
const path = require("path");

// Read the territories.js file
const territoriesPath = path.join(
  __dirname,
  "../../../app/components/maps/territories.js",
);
const content = fs.readFileSync(territoriesPath, "utf8");

// Extract the TERRITORIES_BY_STATE object
const match = content.match(
  /export const TERRITORIES_BY_STATE = ({[\s\S]*?});/,
);

if (!match) {
  console.error("Could not find TERRITORIES_BY_STATE in territories.js");
  process.exit(1);
}

// Convert the JavaScript object to JSON
// This is a simplified approach - in production, you'd use a proper parser
const dataString = match[1]
  .replace(/(\w+):/g, '"$1":') // Quote keys
  .replace(/'/g, '"') // Replace single quotes with double quotes
  .replace(/,(\s*[}\]])/g, "$1"); // Remove trailing commas

try {
  const data = eval("(" + dataString + ")");

  // Write to JSON file
  const outputPath = path.join(__dirname, "../public/territories.json");
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log("✅ Successfully converted territories.js to territories.json");
  console.log(`📁 Output: ${outputPath}`);

  // Count territories
  let totalTerritories = 0;
  for (const state in data) {
    totalTerritories += data[state].length;
  }
  console.log(`📊 Total territories: ${totalTerritories}`);
  console.log(`📊 Total states: ${Object.keys(data).length}`);
} catch (error) {
  console.error("Error converting data:", error);
  process.exit(1);
}
