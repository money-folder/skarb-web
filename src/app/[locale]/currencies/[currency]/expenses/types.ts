import { z } from "zod";

import { createExpenseRequestSchema, expenseFormSchema } from "./validation";

export type ExpenseDb = {
  id: string;
  date: Date;
  moneyAmount: number;
  currency: string;
  type: string;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  ownerId: string;
};

export type ClientExpenseDto = ExpenseDb;

export type CreateExpenseDto = {
  moneyAmount: number;
  date: Date;
  type: string;
  ownerId: string;
  currency: string;
  comment?: string;
};

export type CreateExpenseRequestDto = z.infer<
  typeof createExpenseRequestSchema
>;

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export type FetchExpensesParams = {
  fromTs?: number;
  toTs?: number;
};
