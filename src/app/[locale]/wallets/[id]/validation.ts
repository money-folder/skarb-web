import { z } from "zod";

export const createWhistoryRequstSchema = z.object({
  walletId: z.string(),
  moneyAmount: z.number(),
  date: z.number(),
  comment: z.string().optional(),
});

export const updateWhistoryRequstSchema = z.object({
  id: z.string(),
  data: z.object({
    moneyAmount: z.number(),
    date: z.number(),
    comment: z.string().optional(),
  }),
});

export const whistoryFormSchema = z.object({
  date: z.date(),
  amount: z.number(),
  comment: z.string().optional(),
});
