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

export const findWallet = async (whistoryId: string) => {
  const whistory = await prisma.walletHistory.findUnique({
    where: { id: whistoryId },
  });

  if (!whistory) {
    return null;
  }

  return await prisma.wallet.findUnique({ where: { id: whistory.walletId } });
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

export const archive = async (id: string) => {
  return await prisma.walletHistory.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const unarchive = async (id: string) => {
  return await prisma.walletHistory.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
};

export const destroy = async (id: string) => {
  return await prisma.walletHistory.delete({ where: { id } });
};
