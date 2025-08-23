import { api } from "~/lib/axios";
import type { UserSchema } from "~/schemas/userSchema";

export const editUserFn = async (code: string, user: UserSchema) => {
  return api.put(`/users/${code}`, {
    ...user,
  });
};
