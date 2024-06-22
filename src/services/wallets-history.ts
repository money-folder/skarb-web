import { auth } from "@/auth";
import { CreateWhistoryRequestDto } from "@/types/wallets-history";
import * as whistoryRepository from "@/repositories/wallets-history";
import { ErrorCauses } from "@/types/errors";

export const getWalletHistory = async (walletId: string) => {
  return await whistoryRepository.findByWallet(walletId);
};

export const getCurrentUserWalletHistory = async (walletId: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  return await whistoryRepository.findUserWallet(session.user.id, walletId);
};

export const createWalletHistory = async (dto: CreateWhistoryRequestDto) => {
  return await whistoryRepository.create({
    ...dto,
    date: new Date(dto.date),
  });
};
