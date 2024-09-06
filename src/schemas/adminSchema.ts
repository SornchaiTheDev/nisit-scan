import { z } from "zod";

export const adminSchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
});

export type AdminSchema = z.infer<typeof adminSchema>;
