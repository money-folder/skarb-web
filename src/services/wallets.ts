import { auth } from "@/auth";
import * as walletsRepository from "@/repositories/wallets";
import { ClientWalletDto } from "@/types/wallets";

export const getCurrentUserWallets = async (): Promise<ClientWalletDto[]> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non Authorized!");
  }

  const wallets = await walletsRepository.findByUser(session.user.id);
  return wallets.map((w) => ({
    ...w,
    latestBalanceTs: new Date().toLocaleString(),
    latestBalance: 0,
  }));
};
