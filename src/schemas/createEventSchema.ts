import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string(),
  place: z.string(),
  date: z.date(),
  host: z.string(),
  owner: z.string(),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;
