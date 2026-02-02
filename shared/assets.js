import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve("dist/client/manifest.json");

const raw = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

const normalize = (p) => "/static/" + p.replace(/^dist\/client\//, "");

export const assetsMap = {
  js: Object.values(raw)
    .filter((p) => p.endsWith(".js"))
    .map(normalize),

  css: Object.values(raw)
    .filter((p) => p.endsWith(".css"))
    .map(normalize),
};
