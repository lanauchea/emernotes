import { renderToPipeableStream } from "react-dom/server";
import { assetsMap } from "@/shared/assets";
import { routes } from "@/App";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
import { createFetchRequest } from "@/server/request";
import { StrictMode } from "react";
import { Html } from "./Html";

export async function render(request, response) {
  let { query, dataRoutes } = createStaticHandler(routes);
  let remixRequest = createFetchRequest(request, response);

  let context = await query(remixRequest);

  if (context instanceof Response) {
    throw context;
  }

  let router = createStaticRouter(dataRoutes, context);

  let didError = false;
  let statusCode;

  const { pipe, abort } = renderToPipeableStream(
    <StrictMode>
      <Html assetsMap={assetsMap}>
        <StaticRouterProvider
          router={router}
          context={context}
          nonce="the-nonce"
        />
      </Html>
    </StrictMode>,
    {
      onShellError(err) {
        console.error("[ssr]: shell error: ", err);
        response.status(statusCode).send("<h1>Something went wrong</h1>");
      },
      onShellReady() {
        statusCode = context.statusCode ?? (didError ? 500 : 200);

        response.setHeader("Cache-Control", "no-cache");

        response.status(statusCode);
        response.setHeader("Content-Type", "text/html; charset=utf-8");

        response.write("<!DOCTYPE html>");

        pipe(response);
      },

      onError(err, errInfo) {
        didError = true;
        console.error(`[ssr]: an error occured ${err}:${errInfo}`);
      },
    },
  );

  return { abort };
}
