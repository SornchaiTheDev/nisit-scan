import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const GET = (req: Request) => {
  const url = new URL(req.url);
  const redirectTo = url.searchParams.get("redirectTo");

  cookies().delete("accessToken");
  cookies().delete("refreshToken");
  cookies().delete("session_id");

  redirect(`/auth/sign-in${redirectTo ? `?redirectTo=${redirectTo}` : ""}`);
};
