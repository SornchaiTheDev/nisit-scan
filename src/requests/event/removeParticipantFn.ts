import { api } from "~/lib/axios";

export const removeParticipantFn = async (
  eventId: string,
  barcodes: string[],
) => {
  const { data } = await api.post(
    `/events/${eventId}/participants/batchdelete`,
    {
      barcodes,
    },
  );
  return data;
};
