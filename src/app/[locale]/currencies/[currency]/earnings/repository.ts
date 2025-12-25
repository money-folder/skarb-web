import { prisma } from "@/prisma";
import {
  CreateEarningDto,
  FetchEarningsParams,
  FetchEarningsSumParams,
  UpdateEarningDto,
} from "./types";

export const getEarningsTypesByUserCurrency = async (
  userId: string,
  currency: string,
) => {
  const types = await prisma.earning.groupBy({
    by: ["type"],
    where: { ownerId: userId, currency },
  });
  return types;
};

export const findByUserCurrency = async (
  userId: string,
  currency: string,
  params?: FetchEarningsParams,
) => {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const skip = (page - 1) * pageSize;

  const whereClause = {
    ownerId: userId,
    currency,
    date: {
      lte: params?.toTs ? new Date(params.toTs) : undefined,
      gte: params?.fromTs ? new Date(params.fromTs) : undefined,
    },
    type:
      params?.types && params.types.length > 0
        ? {
            in: params.types,
          }
        : undefined,
    comment: params?.comment
      ? {
          contains: params.comment,
          mode: "insensitive" as const,
        }
      : undefined,
  };

  const [earnings, total] = await Promise.all([
    prisma.earning.findMany({
      where: whereClause,
      orderBy: {
        date: "desc",
      },
      skip,
      take: pageSize,
    }),
    prisma.earning.count({
      where: whereClause,
    }),
  ]);

  return { earnings, total };
};

export const create = async (dto: CreateEarningDto) => {
  return prisma.earning.create({
    data: dto,
  });
};

export const update = async (dto: UpdateEarningDto) => {
  const { id, ...data } = dto;
  return prisma.earning.update({
    where: { id },
    data,
  });
};

export const findEarning = async (id: string) => {
  const earning = await prisma.earning.findUnique({
    where: { id },
  });

  if (!earning) {
    return null;
  }

  return earning;
};

export const destroyEarning = async (id: string) => {
  return prisma.earning.delete({ where: { id } });
};

export const getSumByUserCurrency = async (
  userId: string,
  currency: string,
  params?: FetchEarningsSumParams,
) => {
  const result = await prisma.earning.aggregate({
    _sum: {
      moneyAmount: true,
    },
    where: {
      ownerId: userId,
      currency,
      date: {
        lte: params?.toTs ? new Date(params.toTs) : undefined,
        gte: params?.fromTs ? new Date(params.fromTs) : undefined,
      },
    },
  });

  return result._sum.moneyAmount ?? 0;
};
