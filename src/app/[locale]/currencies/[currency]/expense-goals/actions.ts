"use server";

import { revalidatePath } from "next/cache";

import {
  createUserCurrencyExpenseGoal,
  destroySelfExpenseGoal,
  getUserCurrencyExpenseGoals,
} from "./service";
import { ClientExpenseGoalDto, CreateExpenseGoalRequestDto } from "./types";
import { createExpenseGoalRequestSchema } from "./validation";

export type ExpenseGoal = ClientExpenseGoalDto;

export async function createExpenseGoal(dto: CreateExpenseGoalRequestDto) {
  const validationResult = createExpenseGoalRequestSchema.safeParse(dto);

  if (validationResult.error) {
    throw new Error("Create expense goal validation failed!", {
      cause: validationResult.error,
    });
  }

  await createUserCurrencyExpenseGoal(dto);
  revalidatePath(`/currencies/${dto.currency}/expenses`);
}

export const fetchExpenseGoals = async (currency: string, fromTs?: number) => {
  try {
    const expenseGoals = await getUserCurrencyExpenseGoals(currency, fromTs);
    return { success: true, data: expenseGoals };
  } catch (error) {
    console.error(error);
    return { success: false, data: [], error };
  }
};

export const destroyExpenseGoal = async (id: string, currency: string) => {
  try {
    await destroySelfExpenseGoal(id);
    revalidatePath(`/currencies/${currency}/expenses`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};
