import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import type { Db } from "mongodb";
import { env } from "../../config/env";
import { sendEmail } from "../../lib/notify";

/**
 * Creates the Better Auth instance once the native MongoDB `Db` is ready.
 * Called from server.ts after connectAll().
 *
 * Donor-specific fields live directly on Better Auth's `user` table via
 * `additionalFields` — this avoids maintaining a second "profile" collection
 * that has to be kept in sync with the auth user record.
 */
export function createAuth(db: Db) {
  return betterAuth({
    database: mongodbAdapter(db),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: env.CORS_ORIGINS,

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      // No OTP / email verification requirement, per product decision —
      // registration should stay a single fast step.
      requireEmailVerification: false,
      // NOTE: donors who registered with a placeholder phone-based email
      // (see web/app/register/page.tsx) have no real inbox, so "forgot
      // password" only actually reaches someone who gave a real email at
      // sign-up. sendEmail is a console.log stub until a real provider is
      // plugged in — see server/src/lib/notify.ts.
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "RoktoSetu — পাসওয়ার্ড রিসেট করুন",
          text: `আপনার পাসওয়ার্ড রিসেট করতে এই লিংকে যান (১ ঘণ্টার জন্য বৈধ): ${url}`,
        });
      },
    },

    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // refresh session once a day of activity
    },

    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "user", // "user" | "admin"
          input: false, // never settable directly from the client
        },
        phone: {
          type: "string",
          required: true,
        },
        bloodGroup: {
          type: "string",
          required: true,
        },
        division: {
          type: "string",
          required: true,
        },
        district: {
          type: "string",
          required: true,
        },
        upazila: {
          type: "string",
          required: true,
        },
        lastDonationDate: {
          type: "date",
          required: false,
        },
        isAvailable: {
          type: "boolean",
          required: false,
          defaultValue: true,
        },
        donationCount: {
          type: "number",
          required: false,
          defaultValue: 0,
          input: false,
        },
        verified: {
          type: "boolean",
          required: false,
          defaultValue: false,
          input: false, // only an admin action can set this — see modules/admin
        },
      },
    },

    advanced: {
      // We're behind a reverse proxy (Render/Railway) in production.
      useSecureCookies: env.NODE_ENV === "production",
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
