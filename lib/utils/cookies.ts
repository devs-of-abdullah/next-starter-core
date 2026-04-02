import { cookies } from "next/headers";

interface CookieOptions {
  name: string;
  value: string;
  maxAge?: number; // in seconds
}

export async function setRefreshTokenCookie({ name, value, maxAge = 7 * 24 * 60 * 60 }: CookieOptions) {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });
}

export async function clearCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}
