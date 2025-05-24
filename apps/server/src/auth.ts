import { Resend } from "resend";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/drizzle";
import * as schema from "./db/schema";
import { config } from "dotenv";
import { env } from "../env";

config();

const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  emailAndPassword: {
    enabled: true,
    // sendResetPassword: async ({ user, token }) => {
    //   const confirmationUrl = `${process.env.CLIENT_URL}/auth/reset?token=${token}`;
    //   await resend.emails.send({
    //     from: "info@aumentapacientes.com",
    //     to: [user.email],
    //     subject: "Reinicie tu contraseña",
    //     react: <PasswordReset name={user.name} url={confirmationUrl} />,
    //   });
    // },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, token }) => {
      const confirmationUrl = `${env.WEB_URL}/auth/verify?token=${token}`;

      const { error } = await resend.emails.send({
        from: "info@aumentapacientes.com",
        to: user.email,
        subject: "Verifica tu correo electronico",
        text: `Verifica tu correo electronico`,
        html: `Verifica tu correo electronico: ${confirmationUrl}`,
      });

      if (error) {
        return;
      }
    },
  },

  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //   },
  // },
  trustedOrigins: [`${env.WEB_URL}`],
});

type AuthStatus =
  | "IsAuthenticated"
  | "IsNotAuthenticated"
  | "IsMaybeAuthenticated";

/**
 * Represents the authentication status of an application's routes.
 * This type is used to enforce type safety for route authentication requirements.
 *
 * @typedef {string} AuthStatus
 * @property {"IsAuthenticated"} IsAuthenticated - All routes require authentication
 * @property {"IsNotAuthenticated"} IsNotAuthenticated - No routes require authentication
 * @property {"IsMaybeAuthenticated"} IsMaybeAuthenticated - Some routes may require authentication
 *
 * @example

 * const app = new Hono<HonoAppContext<"IsAuthenticated">>();
 *

 * const app = new Hono<HonoAppContext<"IsMaybeAuthenticated">>();
 *

 * const app = new Hono<HonoAppContext<"IsNotAuthenticated">>();
 */
export type HonoAppContext<
  Authenticated extends AuthStatus = "IsMaybeAuthenticated",
> = {
  Variables: {
    user: Authenticated extends "IsAuthenticated"
      ? typeof auth.$Infer.Session.user
      : Authenticated extends "IsNotAuthenticated"
        ? null
        : typeof auth.$Infer.Session.user | null;
    session: Authenticated extends "IsAuthenticated"
      ? typeof auth.$Infer.Session.session
      : Authenticated extends "IsNotAuthenticated"
        ? null
        : typeof auth.$Infer.Session.session | null;
  };
};
