import { prisma } from "@/prisma";
import { Prisma } from "@prisma/client";

import { CreateWalletDto, UpdateWalletRequestDto } from "./types";

export const findById = async (id: string) => {
  return prisma.wallet.findUnique({ where: { id } });
};

export const findOne = async (where: Prisma.WalletWhereUniqueInput) => {
  return prisma.wallet.findUnique({ where });
};

export const findByUser = async (userId: string) => {
  const userWallets = await prisma.wallet.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "asc" },
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

export const findByUserCurrency = async (userId: string, currency: string) => {
  const userWallets = await prisma.wallet.findMany({
    where: { ownerId: userId, currency },
  });

  return userWallets;
};

export const create = async (dto: CreateWalletDto) => {
  return prisma.wallet.create({
    data: dto,
  });
};

export const update = async (dto: UpdateWalletRequestDto) => {
  return prisma.wallet.update({
    where: { id: dto.id },
    data: { name: dto.data.name },
  });
};

export const archive = async (id: string) => {
  return prisma.wallet.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const unarchive = async (id: string) => {
  return prisma.wallet.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
};

export const destroy = async (id: string) => {
  return prisma.wallet.delete({ where: { id } });
};
