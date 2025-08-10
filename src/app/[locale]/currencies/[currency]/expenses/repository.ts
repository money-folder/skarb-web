import { prisma } from "@/prisma";
import { CreateExpenseDto } from "./types";

export const findTypesByUserCurrency = async (
  userId: string,
  currency: string,
) => {
  const groups = await prisma.expense.groupBy({
    by: ["type"],
    where: { ownerId: userId, currency },
  });
  return groups.reduce((acc: string[], { type }) => {
    acc.push(type);
    return acc;
  }, []);
};

export const findByUserCurrency = async (userId: string, currency: string) => {
  const expenses = await prisma.expense.findMany({
    where: { ownerId: userId, currency },
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
