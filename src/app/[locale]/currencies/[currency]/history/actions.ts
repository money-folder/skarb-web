"use server";

import {
  getCurrencyAtTimestamp,
  getCurrentUserCurrencies,
  getCurrentUserCurrencyWhistory,
  getCurrentUserCurrencyWhistoryExpenses,
} from "@/app/[locale]/currencies/[currency]/history/service";
import {
  FetchCurrencyIntervalTotalDiffParams,
  FetchWhistoryParams,
} from "../../../wallets/types";

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
    return { success: false, data: 0, error };
  }
};

export const fetchCurrencyIntervalTotalDiff = async (
  currency: string,
  params: FetchCurrencyIntervalTotalDiffParams,
) => {
  try {
    const [start, end] = await Promise.all([
      getCurrencyAtTimestamp(currency, params.fromTs || new Date(0).valueOf()),
      getCurrencyAtTimestamp(currency, params.toTs || new Date().valueOf()),
    ]);

    return {
      success: true,
      data: end - start,
    };
  } catch (error) {
    console.error(error);
    return { success: false, data: 0, error };
  }
};
