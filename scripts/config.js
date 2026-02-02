import path from "node:path";
import tailwindcss from "@tailwindcss/postcss";
import postcss from "./plugins/postcss.js";
import svg from "./plugins/svg.js";

const workspace = process.cwd();
const isProd = process.env.NODE_ENV === "production";

export const serverConfig = {
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  logLevel: "error",
  sourcemap: "external",
  entryPoints: {
    index: path.join(workspace, "index.js"),
  },
  tsconfig: path.join(workspace, "jsconfig.json"),
  outdir: path.join(workspace, "dist"),
  plugins: [svg()],
};

export const clientConfig = {
  bundle: true,
  treeShaking: true,

  platform: "browser",
  format: "esm",
  target: ["es2022", "chrome100", "firefox100", "safari16"],

  jsx: "automatic",

  entryPoints: {
    app: path.join(workspace, "entry.client.jsx"),
    style: path.join(workspace, "globals.css"),
  },

  outdir: path.join(workspace, "dist", "client"),

  logLevel: "error",
  logOverride: {
    "unsupported-dynamic-import": "silent",
  },

  tsconfig: path.join(workspace, "jsconfig.json"),

  plugins: [
    svg(),
    postcss({
      plugins: [tailwindcss],
      extract: true,
      minimize: isProd,
    }),
  ],
};
