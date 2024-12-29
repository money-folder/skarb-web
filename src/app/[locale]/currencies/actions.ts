"use server";

import {
  getCurrentUserCurrencies,
  getCurrentUserCurrencyWhistory,
} from "@/app/[locale]/currencies/service";
import { FetchWhistoryParams } from "../wallets/types";

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
    const whistory = await getCurrentUserCurrencyWhistory(currency, params);
    return { success: true, data: whistory };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
};
