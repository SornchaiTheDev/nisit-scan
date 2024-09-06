import { api } from "~/lib/axios";
import { AdminSchema } from "~/schemas/adminSchema";

export const addAdminFn = async (admin: AdminSchema) => {
  return await api.post(
    "/admins",
    admin,
    {
      headers: {
        Authorization: "Basic YWRtaW46YWRtaW4=",
      },
    },
  );
};
