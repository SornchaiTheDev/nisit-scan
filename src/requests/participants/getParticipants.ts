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
    `/participants/${eventId}?pageIndex=${pageIndex}&pageSize=${pageSize}&barcode=${barcode}`,
  );
  return event.data;
};
