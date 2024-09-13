import { api } from "~/lib/axios";

export const removeAdminsFn = async (ids: string[]) => {
  return await api.delete("/admins", {
    data: {
      ids,
    },
  });
};
