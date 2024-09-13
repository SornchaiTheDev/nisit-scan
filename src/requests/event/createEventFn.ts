import dayjs from "dayjs";
import { api } from "~/lib/axios";
import { EventSchema } from "~/schemas/eventSchema";
import type { EventRequest } from "~/types/Event";

export const createEventFn = async (event: EventSchema) => {
  const payload: EventRequest = {
    ...event,
    date: dayjs(event.date).format("DD/MM/YYYY"),
  };

  return api.post("/events", payload);
};
