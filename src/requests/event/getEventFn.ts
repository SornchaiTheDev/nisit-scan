import { api } from "~/lib/axios";
import type { Event } from "~/types";

export const getEventFn = async (eventId: string) => {
  const { data } = await api.get<Event>(`/events/${eventId}`);
  return data;
};
