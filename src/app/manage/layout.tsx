import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { AccessToken } from "~/types";
import dayjs from "dayjs";
import SessionWrapper from "~/wrapper/SessionWrapper";

const Client = dynamic(() => import("./client"), { ssr: false });

export default async function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = cookies().get("accessToken");
  if (!accessToken) {
    return redirect("/auth/sign-out?redirect_to=/manage");
  }

  const { role, name, exp } = jwtDecode<AccessToken>(accessToken.value);

  if (dayjs(exp * 1000).isBefore(Date.now()) || role !== "admin") {
    return redirect("/auth/sign-out?redirect_to=/manage");
  }

  return (
    <SessionWrapper>
      <Client {...{ name }}>{children}</Client>
    </SessionWrapper>
  );
}
