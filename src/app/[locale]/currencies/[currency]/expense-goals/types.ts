import type { VariantProps } from "class-variance-authority";
import { z } from "zod";

import { badgeVariants } from "@/components/ui/badge";

import {
  createExpenseGoalRequestSchema,
  expenseGoalFormSchema,
} from "./validation";

export type ExpenseGoalFormValues = z.infer<typeof expenseGoalFormSchema>;

export type CreateExpenseGoalRequestDto = z.infer<
  typeof createExpenseGoalRequestSchema
>;

export type CreateExpenseGoalDto = {
  moneyAmount: number;
  startDate: Date;
  endDate: Date;
  type: string;
  ownerId: string;
  currency: string;
};

export type ExpenseGoalDb = {
  id: string;
  startDate: Date;
  endDate: Date;
  moneyAmount: number;
  currency: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  ownerId: string;
  total: number;
};

export type ClientExpenseGoalDto = ExpenseGoalDb;

export interface GoalStatus {
  text: string;
  style: VariantProps<typeof badgeVariants>["variant"];
}
