"use server";

import {
  getCurrentUserCurrencies,
  getCurrentUserCurrencyWhistory,
  getCurrentUserCurrencyWhistoryExpenses,
} from "@/app/[locale]/currencies/[currency]/history/service";
import { FetchWhistoryParams } from "../../../wallets/types";

export const fetchCurrentUserCurrencies = async () => {
  try {
    const currencies = await getCurrentUserCurrencies();
    return { success: true, data: currencies };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
};

export const fetchCurrencyWhistory = async (
  currency: string,
  params: FetchWhistoryParams,
) => {
  try {
    const data = await getCurrentUserCurrencyWhistory(currency, params);
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
};

export const fetchCurrencyWhistoryExpenses = async (
  currency: string,
  params: FetchWhistoryParams,
) => {
  try {
    const { negativeExpensesSum } =
      await getCurrentUserCurrencyWhistoryExpenses(currency, params);
    return { success: true, data: negativeExpensesSum };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
};
