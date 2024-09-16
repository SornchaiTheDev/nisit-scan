import dayjs from "~/lib/dayjs";
import { api } from "~/lib/axios";
import type { EventSchema } from "~/schemas/eventSchema";
import type { EventRequest } from "~/types/Event";

export const editEventFn = async (eventId: string, event: EventSchema) => {
  const payload: EventRequest = {
    ...event,
    date: dayjs(event.date).format("DD/MM/YYYY"),
  };
  const { data } = await api.put(`/events/${eventId}`, payload);
  return data;
};
