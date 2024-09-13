import { api } from "~/lib/axios";
import { Participant } from "~/types/Event";

interface Response {
  totalRows: number;
  participants: Participant[];
}

export const getParticipantsFn = async (
  eventId: string,
  barcode: string,
  pageIndex: number,
  pageSize: number,
) => {
  const event = await api.get<Response>(
    `/events/${eventId}/participants?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${barcode}`,
  );
  return event.data;
};
