"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { admins } from "@/data/admin";
import { getSession, logout } from "@/lib/session";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginAction(_prevState: unknown, formData: FormData) {
  try {
    const username = (formData.get("username") as string)?.toLowerCase();
    const password = formData.get("password") as string;

    console.log(`[Login] Attempt for username: ${username}`);

    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      console.log(`[Login] Validation failed: ${result.error.issues[0].message}`);
      return { error: result.error.issues[0].message };
    }

    const admin = admins.find((a) => a.username.toLowerCase() === username);

    if (!admin) {
      console.log(`[Login] User not found: ${username}`);
      return { error: "User not found" };
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      console.log(`[Login] Invalid password for: ${username}`);
      return { error: "Invalid credentials" };
    }

    const session = await getSession();
    session.adminId = admin.id;
    session.username = admin.username;
    session.isLoggedIn = true;
    await session.save();

    console.log(`[Login] Success! Redirecting...`);
    redirect("/staff/manage");
  } catch (error) {
    if (error instanceof Error && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("[Login] Unexpected error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
