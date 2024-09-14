import { api } from "~/lib/axios";
import { Event } from "~/types/Event";

interface Response {
  totalRows: number;
  events: Event[];
}

export const getEventPaginationFn = async (
  search: string,
  pageIndex: number,
  pageSize: number,
) => {
  const event = await api.get<Response>(
    `/events?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${search}`,
  );
  return event.data;
};
