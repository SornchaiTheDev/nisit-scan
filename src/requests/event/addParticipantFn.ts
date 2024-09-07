import { api } from "~/lib/axios";
import { Participant } from "~/types/Event";

interface ScanResponse {
  code: string;
  participant: Participant;
}
export const addParticipantFn = async (eventId: string, barcode: string) => {
  const { data } = await api.post<ScanResponse>(`/participants/add`, {
    eventId,
    barcode,
  });

  return data;
};
