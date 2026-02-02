import { convert } from "@/shared/convert";

/** @type {(import("react-router").RouteObject[])}*/
export const routes = [
  {
    path: "/",
    lazy: () => import("./pages/Root").then(convert),
    children: [
      {
        index: true,
        lazy: () => import("./pages/Home").then(convert),
      },
      {
        path: "about",
        lazy: () => import("./pages/About").then(convert),
      },
      {
        path: "*",
        lazy: () => import("./pages/NotFound").then(convert),
      },
    ],
  },
];
