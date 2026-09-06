import { z } from "zod";

export const expenseGoalFormSchema = z
  .object({
    moneyAmount: z.number().min(0.01, "Amount is required"),
    startDate: z.date(),
    endDate: z.date(),
    type: z.string().trim().min(1, "Type is required").max(255),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export const createExpenseGoalRequestSchema = z.object({
  moneyAmount: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  type: z.string(),
  currency: z.string(),
});
