import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getBasePath } from "~/lib/getBasePath";

export const dynamic = "force-dynamic";

export const GET = (req: Request) => {
  const url = new URL(req.url);
  const redirectTo = url.searchParams.get("redirect_to");

  cookies().delete("accessToken");
  cookies().delete("refreshToken");
  cookies().delete("session_id");

  const origin = process.env.WEB_ORIGIN;

  redirect(
    `${origin}/${getBasePath()}/auth/sign-in${redirectTo ? `?redirect_to=${redirectTo}` : ""}`,
  );
};
