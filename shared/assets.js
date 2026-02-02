import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve("dist/client/manifest.json");

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

const toStatic = (p) => `/static/${p.replace(/^\//, "")}`;

export const assetsMap = {
  js: Object.values(manifest)
    .filter((v) => typeof v === "string" && v.endsWith(".js"))
    .map(toStatic),

  css: Object.values(manifest)
    .filter((v) => typeof v === "string" && v.endsWith(".css"))
    .map(toStatic),
};
