import { api } from "~/lib/axios";

export const removeParticipantFn = async (eventId: string, ids: string[]) => {
  const { data } = await api.post(`/participants/${eventId}/remove`, {
    ids,
  });
  return data;
};
