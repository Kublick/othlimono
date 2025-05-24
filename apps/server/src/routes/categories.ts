import { Hono } from "hono";
import { HonoAppContext } from "../auth";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export const categoriesRouter = new Hono<HonoAppContext>().get(
  "/",
  async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ message: "unauthorized" }, 401);
    try {
      const data = await db
        .select()
        .from(categories)
        .where(eq(categories.userId, user.id))
        .orderBy(asc(categories.order));
      return c.json(data, 200);
    } catch (e) {
      console.log(e);
      return c.json({ message: "error" }, 500);
    }
  }
);
