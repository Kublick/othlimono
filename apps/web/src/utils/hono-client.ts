// Please serve/build the server first to get the types
// import { type AppType, type Client } from "@workspace/server";
import { hc } from "hono/client";
import { type AppType } from "../../../server/src/app";

const hcWithType = (...args: Parameters<typeof hc>) => hc<AppType>(...args);

export const client = hcWithType(import.meta.env.VITE_SERVER_URL, {
  init: { credentials: "include" },
});
