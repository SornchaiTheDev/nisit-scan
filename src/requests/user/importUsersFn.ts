import { api } from "~/lib/axios";
import { User } from "~/types";

export const importUsersFn = async (users: User[]) => {
  return await api.post("/users/import", { users });
};
