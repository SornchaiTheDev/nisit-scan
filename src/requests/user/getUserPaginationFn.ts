import { api } from "~/lib/axios";
import { User } from "~/types";

interface Response {
  users: User[];
  totalRows: number;
}

export const getUserPaginationFn = async (
  search: string,
  pageIndex: number,
  pageSize: number,
) => {
  const event = await api.get<Response>(
    `/users?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${search}`,
  );
  return event.data;
};
