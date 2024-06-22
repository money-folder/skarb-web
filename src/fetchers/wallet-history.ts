import { getWalletHistory } from "@/services/wallets-history";

export const fetchWalletHistory = async (walletId: string) => {
  try {
    const walletHistory = await getWalletHistory(walletId);
    return { success: true, data: walletHistory };
  } catch (error: any) {
    console.error(error);
    return { success: false, data: null, error };
  }
};
