"use server";

import { getCurrentUserAppData } from "./service";
import { ExportAllParams } from "./types";

export const exportAll = async (params: ExportAllParams) => {
  try {
    const data = await getCurrentUserAppData(params);
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
};
