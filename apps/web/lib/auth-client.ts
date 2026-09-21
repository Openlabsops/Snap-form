import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { expireClientSession, registerSessionClearedHandler } from "@/lib/auth-session";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_URL must be configured");
}

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    inferAdditionalFields({
      user: {
        username: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signOut, useSession, getSession } = authClient;

export function refreshSession() {
  authClient.$store.notify("$sessionSignal");
}

registerSessionClearedHandler(refreshSession);

export { expireClientSession };

export async function logout() {
  try {
    await signOut();
  } finally {
    expireClientSession();
  }
}
