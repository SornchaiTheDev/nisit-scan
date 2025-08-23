import { api } from "~/lib/axios";
import { UserSchema } from "~/schemas/userSchema";

export const addUserFn = async (user: UserSchema) => {
  return await api.post("/users", user);
};
