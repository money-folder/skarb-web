import { z } from "zod";

export const createWalletRequestSchema = z.object({
  name: z.string(),
  currency: z.string(),
});

export const updateWalletRequestSchema = z.object({
  id: z.string(),
  data: z.object({
    name: z.string(),
  }),
});

export const walletFormSchema = z.object({
  name: z.string(),
  currency: z.string(),
});
