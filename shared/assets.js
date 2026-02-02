import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// try a few sensible locations for manifest (dist/client when built, project root when developing)
const candidates = [
  path.join(process.cwd(), "dist", "client", "manifest.json"),
  path.join(__dirname, "..", "dist", "client", "manifest.json"),
  path.join(__dirname, "dist", "client", "manifest.json"),
  path.join(process.cwd(), "client", "manifest.json"),
  path.join(process.cwd(), "dist", "manifest.json"),
];

let manifestPath = candidates.find((p) => {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
});

if (!manifestPath) {
  throw new Error(
    `manifest.json not found. looked at:\n${candidates.join("\n")}`,
  );
}

const raw = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

/**
 * Normalize a file path (whatever the manifest produced) into a URL under /static/
 * - handle values like:
 *    "app-ABC.js"
 *    "client/app-ABC.js"
 *    "dist/client/app-ABC.js"
 *    "./dist/client/app-ABC.js"
 *    "/dist/client/app-ABC.js"
 */
function toStaticUrl(p) {
  if (!p || typeof p !== "string") return null;

  // normalize to posix style for predictable replacements
  const posix = p.replace(/\\/g, "/").replace(/^\.\//, "").replace(/^\//, "");

  // remove any leading "dist/client/" or "client/" so result becomes basename or assets/...
  const cleaned = posix.replace(/^dist\/client\//, "").replace(/^client\//, "");

  return `/static/${cleaned}`;
}

/**
 * Collect assets robustly (supports flat manifest and more nested shapes)
 */
function collectAssets(manifest) {
  const js = new Set();
  const css = new Set();

  for (const value of Object.values(manifest)) {
    if (typeof value === "string") {
      if (value.endsWith(".js")) js.add(toStaticUrl(value));
      if (value.endsWith(".css")) css.add(toStaticUrl(value));
      continue;
    }

    // esbuild-plugin-manifest sometimes outputs objects like { file: 'app-XXX.js', css: [...] }
    if (
      value?.file &&
      typeof value.file === "string" &&
      value.file.endsWith(".js")
    ) {
      js.add(toStaticUrl(value.file));
    }

    if (Array.isArray(value?.css)) {
      value.css.forEach((c) => {
        if (typeof c === "string" && c.endsWith(".css"))
          css.add(toStaticUrl(c));
      });
    }

    // fallback: if object has assets nested as strings
    if (typeof value === "object" && value !== null) {
      for (const v of Object.values(value)) {
        if (typeof v === "string") {
          if (v.endsWith(".js")) js.add(toStaticUrl(v));
          if (v.endsWith(".css")) css.add(toStaticUrl(v));
        }
        if (Array.isArray(v)) {
          v.forEach((x) => {
            if (typeof x === "string") {
              if (x.endsWith(".js")) js.add(toStaticUrl(x));
              if (x.endsWith(".css")) css.add(toStaticUrl(x));
            }
          });
        }
      }
    }
  }

  return {
    js: [...js].filter(Boolean),
    css: [...css].filter(Boolean),
  };
}

export const assetsMap = collectAssets(raw);
