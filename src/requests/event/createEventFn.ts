import dayjs from "dayjs";
import { api } from "~/lib/axios";
import { CreateEventSchema } from "~/schemas/createEventSchema";
import type { CreateEventRequest } from "~/types/Event";

export const createEventFn = async (event: CreateEventSchema) => {
  const payload: CreateEventRequest = {
    ...event,
    date: dayjs(event.date).format("DD/MM/YYYY"),
  };

  return api.post("/events/create", payload, {
    headers: {
      "X-Admin-Id": "590b3933-27f3-4f71-949a-6f86f9257523",
    },
  });
};
