import { z } from "zod";

export const userSchema = z.object({
  code: z.string().regex(/\d{10}/),
  full_name: z.string(),
  gmail: z.string().email(),
  major: z.string().min(2),
});

export type UserSchema = z.infer<typeof userSchema>;
