import express from "express";
import helmet from "helmet";
import compression from "compression";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "@/entry.server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);

const app = express();
app.disable("etag");
app.disable("x-powered-by");
app.set("trust proxy", true);

const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
const ABORT_TIMEOUT = 10_000;

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(compression());

// static / client assets
if (isProd) {
  app.use("/static", express.static(resolve("client")));
  app.use(express.static(resolve("../public")));
}

// catch-all handler
app.all("*all", async (req, res) => {
  let abort;

  try {
    ({ abort } = await render(req, res));
  } catch (err) {
    // If render threw a Response (redirect), render already forwarded it.
    // But keep a safe fallback:
    console.error("[app] render threw:", err);
    if (err instanceof Response) {
      // If a web Response was thrown, try to forward it (best-effort)
      try {
        const text = await err.text();
        for (const [k, v] of err.headers.entries()) {
          if (res.append) res.append(k, v);
          else res.setHeader(k, v);
        }
        return res.status(err.status || 302).send(text);
      } catch (e) {
        // fallback
      }
    }
    return res.status(500).send("Internal Server Error");
  }

  const timeout = setTimeout(() => {
    abort?.();
  }, ABORT_TIMEOUT);

  res.on("close", () => clearTimeout(timeout));
  res.on("error", () => clearTimeout(timeout));
});

app.listen(port, () => {
  console.log(`[app]: running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error("[fatal]: unhandledRejection ", err);
});
process.on("uncaughtException", (err) => {
  console.error("[fatal]: uncaughtException ", err);
});

export default app;
