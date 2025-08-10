"use server";

import { revalidatePath } from "next/cache";
import {
  createUserCurrencyExpense,
  destroySelfExpense,
  getUserCurrencyExpenses,
  getUserCurrencyExpensesTypes,
} from "./service";
import { CreateExpenseRequestDto } from "./types";
import { createExpenseRequestSchema } from "./validation";

export const fetchTypes = async (currency: string) => {
  try {
    const types = await getUserCurrencyExpensesTypes(currency);
    return { success: true, data: types };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
};

export const fetchExpenses = async (currency: string) => {
  try {
    const expenses = await getUserCurrencyExpenses(currency);
    return { success: true, data: expenses };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
};

export async function createExpense(dto: CreateExpenseRequestDto) {
  const validationResult = createExpenseRequestSchema.safeParse(dto);
  if (validationResult.error) {
    throw new Error(
      "Create expense validation failed!",
      validationResult.error,
    );
  }

  await createUserCurrencyExpense(dto);
  revalidatePath(`/currencies/${dto.currency}/expenses`);
}

export const destroyExpense = async (id: string, currency: string) => {
  try {
    await destroySelfExpense(id);
    revalidatePath(`/currencies/${currency}/expenses`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};
