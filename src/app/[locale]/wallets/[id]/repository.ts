import { Prisma } from "@prisma/client";

import { prisma } from "@/prisma";

import {
  CreateWhistoryDto,
  UpdateWhistoryRequestDto,
} from "@/app/[locale]/wallets/[id]/types";
import { FetchChartWhistoryParams, FetchWhistoryParams } from "../types";

export const findByWallet = async (walletId: string) => {
  const where: Prisma.WalletHistoryWhereInput = {
    AND: [{ walletId }],
  };

  return prisma.walletHistory.findMany({
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

  return prisma.wallet.findUnique({ where: { id: whistory.walletId } });
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

  const skip =
    params?.page && params?.pageSize
      ? (params.page - 1) * params.pageSize
      : undefined;
  const take = params?.pageSize;

  const [data, total] = await Promise.all([
    prisma.walletHistory.findMany({
      where,
      skip,
      take,
      orderBy: {
        date: "desc",
      },
    }),
    prisma.walletHistory.count({ where }),
  ]);

  return { data, total };
};

export const findUserChartWallet = async (
  userId: string,
  walletId: string,
  params?: FetchChartWhistoryParams,
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

  const data = await prisma.walletHistory.findMany({
    where,
    orderBy: {
      date: "asc",
    },
  });

  return { data };
};

export const findById = async (id: string) => {
  return prisma.walletHistory.findFirst({ where: { id } });
};

export const create = async (dto: CreateWhistoryDto) => {
  return prisma.walletHistory.create({
    data: dto,
  });
};

export const update = async (dto: UpdateWhistoryRequestDto) => {
  return prisma.walletHistory.update({
    where: { id: dto.id },
    data: {
      date: new Date(dto.data.date),
      moneyAmount: dto.data.moneyAmount,
      comment: dto.data.comment,
    },
  });
};

export const archive = async (id: string) => {
  return prisma.walletHistory.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const unarchive = async (id: string) => {
  return prisma.walletHistory.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
};

export const destroy = async (id: string) => {
  return prisma.walletHistory.delete({ where: { id } });
};

export const findByWalletAtTimestamp = async (
  walletId: string,
  timestamp: Date,
) => {
  return prisma.walletHistory.findFirst({
    where: {
      walletId,
      date: {
        lte: timestamp,
      },
    },
    orderBy: {
      date: "desc",
    },
  });
};
