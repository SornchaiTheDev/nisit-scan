import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { notFound } from "next/navigation";

const Client = dynamic(() => import("./client"), { ssr: false });

interface AccessToken {
  email: string;
  name: string;
  role: string;
  exp: number;
}
export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = cookies().get("accessToken");
  if (!accessToken) {
    return notFound();
  }

  const { role, name } = jwtDecode<AccessToken>(accessToken.value);
  if (role !== "admin") {
    return notFound();
  }
  return <Client {...{ name }}>{children}</Client>;
}
