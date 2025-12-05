#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

const getInstalledSpec = (pkg: any) =>
  packageJson.dependencies?.[pkg] ?? packageJson.devDependencies?.[pkg] ?? "not found";

console.log("Checking beta versions...\n");

const dependencyEntries = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {})
];

const packages = Array.from(new Set(dependencyEntries))
  .filter((pkg) => pkg.includes("mastra"))
  .sort();

for (const pkg of packages) {
  const installedSpec = getInstalledSpec(pkg);

  try {
    const versionsRaw = execSync(`npm view ${pkg} versions --json`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"]
    });
    const versions = JSON.parse(versionsRaw);
    const latestBeta = versions.filter((v: any) => v.includes("beta")).pop() ?? "none";

    console.log(`${pkg}:`);
    console.log(`  Installed:   ${installedSpec}`);
    console.log(`  Latest Beta: ${latestBeta}`);
  } catch (error) {
    console.log(`${pkg}:`);
    console.log(`  Installed:   ${installedSpec}`);
    console.log(`  Latest Beta: (npm registry error)`);
  }
  console.log("");
}
