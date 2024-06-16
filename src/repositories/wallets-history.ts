import { prisma } from "@/prisma";
import { CreateWhistoryDto } from "@/types/wallets-history";

export const create = async (dto: CreateWhistoryDto) => {
  return await prisma.walletHistory.create({
    data: dto,
  });
};
