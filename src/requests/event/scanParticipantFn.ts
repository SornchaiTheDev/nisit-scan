import { api } from "~/lib/axios";
import { Participant } from "~/types/Event";

interface ScanResponse {
  status: string;
  participant: Participant;
}
export const scanParticipantFn = async (eventId: string, barcode: string) => {
  const { data } = await api.post<ScanResponse>(
    `/event/${eventId}/participant/add`,
    {
      eventId,
      barcode,
    },
  );

  return data;
};
