"use server";

import { getCurrentUserCurrencies } from "@/app/[locale]/currencies/services";

export const fetchCurrentUserCurrencies = async () => {
  try {
    const currencies = await getCurrentUserCurrencies();
    return { success: true, data: currencies };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
};
