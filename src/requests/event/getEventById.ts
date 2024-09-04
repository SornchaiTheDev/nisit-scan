import { api } from "~/lib/axios";
import { Event } from "~/types";

export const getEventById = async (id: string) => {
  const event = await api.get<Event>(`/events/${id}`);
  return event.data;
};
