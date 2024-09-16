import { ScanEventPayload } from "~/hooks/useScanner";
import { api } from "~/lib/axios";
import { Participant } from "~/types/Event";

interface ScanResponse {
  code: string;
  participant: Participant;
}
export const addParticipantFn = async (
  eventId: string,
  { barcode, timestamp }: ScanEventPayload,
) => {
  const { data } = await api.post<ScanResponse>(
    `/events/${eventId}/participants`,
    {
      barcode,
      timestamp: timestamp.toISOString(),
    },
  );

  return data;
};
