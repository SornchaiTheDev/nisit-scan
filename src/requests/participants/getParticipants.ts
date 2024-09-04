import { api } from "~/lib/axios";
import { Participant } from "~/types/Event";

interface Response {
  totalRows: number;
  participants: Participant[];
}

export const getParticipants = async (
  eventId: string,
  pageIndex: number,
  pageSize: number,
) => {
  const event = await api.get<Response>(
    `/participants/${eventId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
  );
  return event.data;
};
