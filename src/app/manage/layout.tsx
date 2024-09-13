import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { AccessToken } from "~/types";

const Client = dynamic(() => import("./client"), { ssr: false });

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = cookies().get("accessToken");
  if (!accessToken) {
    return redirect("/auth/sign-in?redirect_to=/manage/events");
  }

  const { role, name } = jwtDecode<AccessToken>(accessToken.value);
  if (role !== "admin") {
    return redirect("/auth/sign-in?redirect_to=/manage/events");
  }
  return <Client {...{ name }}>{children}</Client>;
}
