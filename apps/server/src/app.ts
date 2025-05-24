import { Hono } from "hono";
import { cors } from "hono/cors";

import { auth, type HonoAppContext } from "./auth.js";
import { env } from "../env.js";

const app = new Hono<HonoAppContext>()
  .get("/health", (c) => {
    return c.json({
      status: "ok",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    });
  })
  .use(
    "*",
    cors({
      origin: [env.WEB_URL ?? "http://localhost:3000"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "PATCH", "DELETE", "PUT"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  )
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  })
  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

export default app;

export type AppType = typeof app;
