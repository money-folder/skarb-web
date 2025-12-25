"use server";

import { revalidatePath } from "next/cache";
import {
  createUserCurrencyEarning,
  destroySelfEarning,
  getUserCurrencyEarnings,
  getUserCurrencyEarningsSum,
  getUserCurrencyEarningsTypes,
  updateUserCurrencyEarning,
} from "./service";
import {
  ClientEarningDto,
  CreateEarningRequestDto,
  FetchEarningsParams,
  FetchEarningsSumParams,
  UpdateEarningRequestDto,
} from "./types";
import {
  createEarningRequestSchema,
  updateEarningRequestSchema,
} from "./validation";

export type Earning = ClientEarningDto;
export type EarningType = string;

export const fetchEarningTypes = async (currency: string) => {
  try {
    const types = await getUserCurrencyEarningsTypes(currency);
    return { success: true, data: types };
  } catch (error) {
    console.error(error);
    return { success: false, data: [], error };
  }
};

export const fetchEarnings = async (
  currency: string,
  params: FetchEarningsParams,
) => {
  try {
    const result = await getUserCurrencyEarnings(currency, params);
    return { success: true, data: result.earnings, total: result.total };
  } catch (error) {
    console.error(error);
    return { success: false, data: [], total: 0, error };
  }
};

export const fetchEarningsSum = async (
  currency: string,
  params: FetchEarningsSumParams,
) => {
  try {
    const sum = await getUserCurrencyEarningsSum(currency, params);
    return { success: true, data: sum };
  } catch (error) {
    console.error(error);
    return { success: false, data: 0, error };
  }
};

export async function createEarning(dto: CreateEarningRequestDto) {
  const validationResult = createEarningRequestSchema.safeParse(dto);
  if (validationResult.error) {
    throw new Error(
      "Create earning validation failed!",
      validationResult.error,
    );
  }

  await createUserCurrencyEarning(dto);
  revalidatePath(`/currencies/${dto.currency}/earnings`);
}

export async function updateEarning(dto: UpdateEarningRequestDto) {
  const validationResult = updateEarningRequestSchema.safeParse(dto);
  if (validationResult.error) {
    throw new Error(
      "Update earning validation failed!",
      validationResult.error,
    );
  }

  await updateUserCurrencyEarning(dto);
  revalidatePath(`/currencies/${dto.currency}/earnings`);
}

export const destroyEarning = async (id: string, currency: string) => {
  try {
    await destroySelfEarning(id);
    revalidatePath(`/currencies/${currency}/earnings`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};
