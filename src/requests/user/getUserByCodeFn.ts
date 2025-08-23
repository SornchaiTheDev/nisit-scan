import { api } from "~/lib/axios";
import { User } from "~/types";

export const getUserByCodeFn = async (code: string) => {
  const res = await api.get<User>(`/users/${code}`);
  return res.data;
};
