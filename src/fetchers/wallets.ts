import { getCurrentUserWallets } from "@/services/wallets";

export const fetchCurrentUserWallets = async () => {
  try {
    const wallets = await getCurrentUserWallets();
    return { success: true, data: wallets };
  } catch (error: any) {
    console.error(error, error.cause);
    return { success: false, data: null, error };
  }
};
