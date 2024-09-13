import { api } from "~/lib/axios";
import { Admin } from "~/types";

interface Response {
  admins: Admin[];
  totalRows: number;
}

export const getAdminPaginationFn = async (
  search: string,
  pageIndex: number,
  pageSize: number,
) => {
  const event = await api.get<Response>(
    `/admins?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${search}`,
  );
  return event.data;
};
