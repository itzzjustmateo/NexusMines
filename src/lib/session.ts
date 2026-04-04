import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { AdminRole } from "@/data/admin";

export type SessionData = {
  adminId?: string;
  username?: string;
  roles?: AdminRole[];
  isLoggedIn: boolean;
};

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters_long",
  cookieName: "nexusmines_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
} as const;

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }

  return session;
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}
