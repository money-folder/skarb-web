import { prisma } from "@/prisma";
import { CreateWhistoryDto } from "@/types/wallets-history";

export const findByWallet = async (walletId: string) => {
  return await prisma.walletHistory.findMany({
    where: { walletId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findUserWallet = async (userId: string, walletId: string) => {
  return await prisma.walletHistory.findMany({
    where: { walletId, wallet: { ownerId: userId } },
    include: { wallet: true },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const create = async (dto: CreateWhistoryDto) => {
  return await prisma.walletHistory.create({
    data: dto,
  });
};
