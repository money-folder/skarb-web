import { prisma } from "@/prisma";
import {
  CreateExpenseDto,
  FetchExpensesParams,
  UpdateExpenseDto,
} from "./types";

export const getExpensesTypesByUserCurrency = async (
  userId: string,
  currency: string,
) => {
  const types = await prisma.expense.groupBy({
    by: ["type"],
    where: { ownerId: userId, currency },
  });
  return types;
};

export const findByUserCurrency = async (
  userId: string,
  currency: string,
  params?: FetchExpensesParams,
) => {
  const expenses = await prisma.expense.findMany({
    where: {
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
            mode: "insensitive",
          }
        : undefined,
    },
    orderBy: {
      date: "desc",
    },
  });

  return expenses;
};

export const findByDate = async (
  userId: string,
  currency: string,
  date: Date,
) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const expenses = await prisma.expense.findMany({
    where: {
      ownerId: userId,
      currency,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return expenses;
};

export const create = async (dto: CreateExpenseDto) => {
  return prisma.expense.create({
    data: dto,
  });
};

export const createMany = async (dtos: CreateExpenseDto[]) => {
  return prisma.expense.createMany({
    data: dtos,
  });
};

export const update = async (dto: UpdateExpenseDto) => {
  const { id, ...data } = dto;
  return prisma.expense.update({
    where: { id },
    data,
  });
};

export const findExpense = async (id: string) => {
  const expense = await prisma.expense.findUnique({
    where: { id },
  });

  if (!expense) {
    return null;
  }

  return expense;
};

export const destroyExpense = async (id: string) => {
  return prisma.expense.delete({ where: { id } });
};
