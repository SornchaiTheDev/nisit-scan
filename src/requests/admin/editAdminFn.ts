import { api } from "~/lib/axios";
import type { AdminSchema } from "~/schemas/adminSchema";

export const editAdminFn = async (
  id: string | undefined,
  admin: AdminSchema,
) => {
  if (!id) throw new Error("Admin ID is required");

  return api.put(`/admins/${id}`, {
    ...admin,
  });
};
