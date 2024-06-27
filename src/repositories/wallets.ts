import { prisma } from "@/prisma";
import { CreateWalletDto } from "@/types/wallets";

export const listAll = async () => {
  const wallets = await prisma.wallet.findMany({});
  return wallets;
};

export const findById = async (id: string) => {
  return await prisma.wallet.findUnique({ where: { id } });
};

export const findByUser = async (userId: string) => {
  const userWallets = await prisma.wallet.findMany({
    where: { ownerId: userId },
    include: {
      history: {
        orderBy: {
          date: "desc",
        },
        take: 2,
      },
    },
  });

  return userWallets;
};

export const create = async (dto: CreateWalletDto) => {
  return await prisma.wallet.create({
    data: dto,
  });
};

export const archive = async (id: string) => {
  return await prisma.wallet.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const unarchive = async (id: string) => {
  return await prisma.wallet.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
};

export const destroy = async (id: string) => {
  return await prisma.wallet.delete({ where: { id } });
};
