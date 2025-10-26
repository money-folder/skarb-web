import { z } from "zod";

export const createExpenseRequestSchema = z.object({
  moneyAmount: z.number(),
  date: z.date(),
  type: z.string(),
  currency: z.string(),
  comment: z.string().optional(),
});

export const createExpensesRequestSchema = z.array(createExpenseRequestSchema);

export const updateExpenseRequestSchema = z.object({
  id: z.string(),
  moneyAmount: z.number(),
  date: z.date(),
  type: z.string(),
  currency: z.string(),
  comment: z.string().optional(),
});

export const expenseFormSchema = z.object({
  moneyAmount: z.number(),
  date: z.date(),
  type: z.string().trim().min(1).max(255),
  comment: z.string().optional(),
});

export const dayExpenseFormSchema = z.object({
  expenses: z.array(
    z.object({
      moneyAmount: z.number().min(0.01, "Amount is required"),
      type: z.string().trim().min(1, "Type is required").max(255),
      comment: z.string().optional(),
    }),
  ),
});
