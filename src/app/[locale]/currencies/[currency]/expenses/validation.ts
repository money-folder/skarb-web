import { z } from "zod";

export const createExpenseRequestSchema = z.object({
  moneyAmount: z.number(),
  date: z.date(),
  type: z.string(),
  currency: z.string(),
  comment: z.string().optional(),
});

export const expenseFormSchema = z.object({
  moneyAmount: z.number(),
  date: z.date(),
  type: z.string(),
  comment: z.string().optional(),
});
