import { z } from "zod";

export const createWalletRequestSchema = z.object({
  name: z.string(),
  currency: z.string(),
});
