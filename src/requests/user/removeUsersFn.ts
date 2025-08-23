import { api } from "~/lib/axios";

export const removeUsersFn = async (codes: string[]) => {
  return await api.delete("/users", {
    data: {
      codes,
    },
  });
};
