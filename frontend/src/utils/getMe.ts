"use server";
import relativeToAbsolute from "./relativeToAbsolute";

export default async function (token: string): Promise<Response | null> {
  return await fetch(relativeToAbsolute(`/api/v1/auth/me`), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-cache",
  });
}
