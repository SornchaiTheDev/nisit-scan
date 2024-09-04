import { api } from "~/lib/axios";

export const removeEventFn = async (eventId: string) => {
  return api.delete(`/events/${eventId}`);
};
