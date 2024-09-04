import { z } from "zod";

export const eventSchema = z.object({
  name: z.string(),
  place: z.string(),
  date: z.date(),
  host: z.string(),
});

export type EventSchema = z.infer<typeof eventSchema>;
