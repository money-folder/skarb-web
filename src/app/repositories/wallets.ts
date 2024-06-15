import { prisma } from "@/prisma";
import { CreateWalletDto } from "@/app/types/wallets";

export const listAll = async () => {
  const wallets = await prisma.wallet.findMany({});
  return wallets;
};

export const findByUser = async (userId: string) => {
  const userWallets = await prisma.wallet.findMany({
    where: { ownerId: userId },
  });

  return userWallets;
};

export const create = async (dto: CreateWalletDto) => {
  return await prisma.wallet.create({
    data: dto,
  });
};
