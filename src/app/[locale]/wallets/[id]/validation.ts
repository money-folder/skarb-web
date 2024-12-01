import { z } from "zod";

export const createWhistoryRequstSchema = z.object({
  walletId: z.string(),
  moneyAmount: z.number(),
  date: z.number(),
  comment: z.string().optional(),
});
