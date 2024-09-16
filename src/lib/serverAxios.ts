"use server";

import axios from "axios";
import { cookies } from "next/headers";

export const serverApi = async () => {
  const getCookies = cookies();
  const parsedCookies = getCookies
    .getAll()
    .reduce((acc, { name, value }) => (acc += `${name}=${value};`), "");

  return axios.create({
    baseURL: process.env.API_URL,
    headers: {
      Cookie: parsedCookies,
    },
  });
};
