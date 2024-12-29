import { Prisma } from "@prisma/client";

import { prisma } from "@/prisma";

import { CreateWhistoryDto } from "@/app/[locale]/wallets/[id]/types";
import { FetchWhistoryParams } from "../types";

export const findByWallet = async (walletId: string) => {
  const where: Prisma.WalletHistoryWhereInput = {
    AND: [{ walletId }],
  };

  return await prisma.walletHistory.findMany({
    where,
    orderBy: {
      date: "desc",
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

export const findUserWallet = async (
  userId: string,
  walletId: string,
  params?: FetchWhistoryParams,
) => {
  const where: Prisma.WalletHistoryWhereInput = {
    AND: [{ walletId }, { wallet: { ownerId: userId } }],
  };

  if (params?.fromTs) {
    (where.AND as Prisma.WalletHistoryWhereInput[]).push({
      date: { gt: new Date(params.fromTs) },
    });
  }

  if (params?.toTs) {
    (where.AND as Prisma.WalletHistoryWhereInput[]).push({
      date: { lt: new Date(params.toTs) },
    });
  }

  return await prisma.walletHistory.findMany({
    where,

    orderBy: {
      date: "asc",
    },
  });
};

export const findById = async (id: string) => {
  return await prisma.walletHistory.findFirst({ where: { id } });
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
