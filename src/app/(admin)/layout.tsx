import dynamic from "next/dynamic";
import SessionWrapper from "~/wrapper/SessionWrapper";
import { redirect } from "next/navigation";
import { isAdmin } from "~/lib/isAdmin";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "~/types";

const Client = dynamic(() => import("./client"), { ssr: false });

export default async function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdmin()) {
    redirect("/auth/sign-out");
  }

  const accessToken = cookies().get("accessToken");
  if (!accessToken) {
    return false;
  }

  const { name } = jwtDecode<AccessToken>(accessToken.value);

  return (
    <SessionWrapper>
      <Client {...{ name }}>{children}</Client>
    </SessionWrapper>
  );
}
