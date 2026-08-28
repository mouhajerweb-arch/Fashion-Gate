"use server";

import { cookies } from "next/headers";

export async function loginUser(name: string, email: string) {
  const cookieStore = await cookies();
  cookieStore.set("fg_session_user", name || email.split("@")[0], {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false, // Accessible to client-side header checks
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("fg_session_user");
}
