"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// In development this defaults to the local server. In production, set
// NEXT_PUBLIC_API_URL to your deployed backend's URL (see .env.example).
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Mirrors the `user.additionalFields` shape declared in
// server/src/modules/auth/auth.config.ts. The two are not type-shared
// across the two independent apps/deployments, so keep them in sync by
// hand if you add a field on the server.
export const authClient = createAuthClient({
  baseURL,
  basePath: "/api/auth",
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false, input: false },
        phone: { type: "string" },
        bloodGroup: { type: "string" },
        division: { type: "string" },
        district: { type: "string" },
        upazila: { type: "string" },
        lastDonationDate: { type: "date", required: false },
        isAvailable: { type: "boolean", required: false },
        donationCount: { type: "number", required: false, input: false },
        verified: { type: "boolean", required: false, input: false },
      },
    }),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;
