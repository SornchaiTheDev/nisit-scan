import { api } from "~/lib/axios";
import { Participant } from "~/types/Event";
import { AddParticipantPayload } from "~/types/Particiapnt";

interface ScanResponse {
  code: string;
  participant: Participant;
}
export const addParticipantFn = async (
  eventId: string,
  {
    barcode,
    timestamp,
    student_code,
  }: AddParticipantPayload,
) => {
  const { data } = await api.post<ScanResponse>(
    `/events/${eventId}/participants`,
    {
      barcode,
      timestamp: timestamp.toISOString(),
      student_code,
    },
  );

  return data;
};
