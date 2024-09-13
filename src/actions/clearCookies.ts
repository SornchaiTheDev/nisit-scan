"use server";
import { cookies } from "next/headers";
export const clearCookies = async () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
};
