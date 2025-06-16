import { api } from "~/lib/axios";
import { Participant } from "~/types/Event";

export const getAllParticipantsFn = async (eventId: string) => {
  const event = await api.get<Participant[]>(
    `/events/${eventId}/participants/all`,
  );
  return event.data;
};
