import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, matchRoutes } from "react-router";
import { RouterProvider } from "react-router/dom";
import { routes } from "@/App";

let lazyMatches = matchRoutes(routes, window.location)?.filter(
  (m) => m.route.lazy,
);

if (lazyMatches && lazyMatches?.length > 0) {
  await Promise.all(
    lazyMatches.map(async (m) => {
      let routeModule = await m.route.lazy();
      Object.assign(m.route, { ...routeModule, lazy: undefined });
    }),
  );
}

let rootEl = document.getElementById("root");
let router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

hydrateRoot(
  rootEl,
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
