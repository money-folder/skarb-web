import { CreateWhistoryRequestDto } from "@/types/wallets-history";
import * as whistoryRepository from "@/repositories/wallets-history";

export const getWalletHistory = async (walletId: string) => {
  return await whistoryRepository.findByWallet(walletId);
};

export const createWalletHistory = async (dto: CreateWhistoryRequestDto) => {
  return await whistoryRepository.create({
    ...dto,
    date: new Date(dto.date),
  });
};
