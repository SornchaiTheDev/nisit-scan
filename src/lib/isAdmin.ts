import dayjs from "~/lib/dayjs";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { AccessToken } from "~/types";

export const isAdmin = () => {
  const accessToken = cookies().get("accessToken");
  if (!accessToken) {
    return false;
  }

  const { role, exp } = jwtDecode<AccessToken>(accessToken.value);

  if (dayjs(exp * 1000).isBefore(Date.now()) || role !== "admin") {
    return false;
  }
  return true;
};
