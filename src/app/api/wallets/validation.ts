import { z } from "zod";

export const createWalletSchema = z.object({
  name: z.string(),
  currency: z.string(),
});
