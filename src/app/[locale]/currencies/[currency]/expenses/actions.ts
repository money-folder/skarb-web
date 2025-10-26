"use server";

import { revalidatePath } from "next/cache";
import {
  createUserCurrencyExpense,
  createUserCurrencyExpenses,
  destroySelfExpense,
  getUserCurrencyExpenses,
  getUserCurrencyExpensesTypes,
  getUserExpensesByDate,
  updateUserCurrencyExpense,
} from "./service";
import {
  CreateExpenseRequestDto,
  FetchExpensesParams,
  UpdateExpenseRequestDto,
} from "./types";
import {
  createExpenseRequestSchema,
  createExpensesRequestSchema,
  updateExpenseRequestSchema,
} from "./validation";

export const fetchTypes = async (currency: string) => {
  try {
    const types = await getUserCurrencyExpensesTypes(currency);
    return { success: true, data: types };
  } catch (error) {
    console.error(error);
    return { success: false, data: [], error };
  }
};

export const fetchExpensesByDate = async (currency: string, date: Date) => {
  try {
    const expenses = await getUserExpensesByDate(currency, date);
    return { success: true, data: expenses };
  } catch (error) {
    console.error(error);
    return { success: false, data: [], error };
  }
};

export const fetchExpenses = async (
  currency: string,
  params: FetchExpensesParams,
) => {
  try {
    const expenses = await getUserCurrencyExpenses(currency, params);
    return { success: true, data: expenses };
  } catch (error) {
    console.error(error);
    return { success: false, data: [], error };
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

export async function createBatchExpenses(dtos: CreateExpenseRequestDto[]) {
  const validationResult = createExpensesRequestSchema.safeParse(dtos);
  if (validationResult.error) {
    throw new Error(
      "Create expenses validation failed!",
      validationResult.error,
    );
  }

  await createUserCurrencyExpenses(dtos);
  if (dtos.length > 0) {
    revalidatePath(`/currencies/${dtos[0].currency}/expenses`);
  }
  return { success: true };
}

export async function updateExpense(dto: UpdateExpenseRequestDto) {
  const validationResult = updateExpenseRequestSchema.safeParse(dto);
  if (validationResult.error) {
    throw new Error(
      "Update expense validation failed!",
      validationResult.error,
    );
  }

  await updateUserCurrencyExpense(dto);
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
