import { prisma } from "@/prisma";
import { CreateExpenseDto, FetchExpensesParams } from "./types";

export const findByUserCurrency = async (
  userId: string,
  currency: string,
  params?: FetchExpensesParams,
) => {
  const expenses = await prisma.expense.findMany({
    where: {
      ownerId: userId,
      currency,
      date:
        params?.fromTs || params?.toTs
          ? {
              lte: params.toTs ? new Date(params.toTs) : undefined,
              gte: params?.fromTs ? new Date(params.fromTs) : undefined,
            }
          : undefined,
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
