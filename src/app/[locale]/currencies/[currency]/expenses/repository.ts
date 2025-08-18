import { prisma } from "@/prisma";
import { CreateExpenseDto, FetchExpensesParams } from "./types";

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
