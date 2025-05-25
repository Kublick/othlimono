import { serve } from "@hono/node-server";
import app from "./app";
import { env } from "../env";
export * from "./hc"

serve(
  {
    fetch: app.fetch,
    port: env.PORT || 4000,
  },
  (info) => {
    console.log(`Server is running on ${env.BETTER_AUTH_URL}`);
  }
);

export * from "./hc";
