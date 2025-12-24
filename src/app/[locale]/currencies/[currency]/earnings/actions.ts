"use server";

import { revalidatePath } from "next/cache";
import {
  createUserCurrencyEarning,
  getUserCurrencyEarnings,
  getUserCurrencyEarningsTypes,
} from "./service";
import {
  ClientEarningDto,
  CreateEarningRequestDto,
  FetchEarningsParams,
} from "./types";
import { createEarningRequestSchema } from "./validation";

export type Earning = ClientEarningDto;
export type EarningType = string;

export const fetchTypes = async (currency: string) => {
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
