import { prisma } from "@/prisma";
import {
  CreateExpenseDto,
  CreateExpenseGoalDto,
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

export const createGoal = async (dto: CreateExpenseGoalDto) => {
  return prisma.expenseGoal.create({
    data: dto,
  });
};

export const findExpenseGoal = async (id: string) => {
  const expenseGoal = await prisma.expenseGoal.findUnique({
    where: { id },
  });

  if (!expenseGoal) {
    return null;
  }

  return expenseGoal;
};

export const findGoalsByUserCurrency = async (
  userId: string,
  currency: string,
  fromTs?: number,
) => {
  const goals = await prisma.expenseGoal.findMany({
    where: {
      ownerId: userId,
      currency,
      endDate: {
        gte: fromTs ? new Date(fromTs) : undefined,
      },
    },
    orderBy: {
      startDate: "desc",
    },
  });

  if (goals.length === 0) return [];

  const minStartDate = goals.reduce(
    (min, g) => (g.startDate < min ? g.startDate : min),
    goals[0].startDate,
  );
  const maxEndDate = goals.reduce(
    (max, g) => (g.endDate > max ? g.endDate : max),
    goals[0].endDate,
  );

  const expenses = await prisma.expense.findMany({
    where: {
      ownerId: userId,
      currency,
      date: { gte: minStartDate, lte: maxEndDate },
    },
    select: { moneyAmount: true, date: true, type: true },
  });

  return goals.map((goal) => {
    const total = expenses
      .filter(
        (e) =>
          e.type === goal.type &&
          e.date >= goal.startDate &&
          e.date <= goal.endDate,
      )
      .reduce((acc, { moneyAmount }) => acc + moneyAmount, 0);

    return { ...goal, total };
  });
};

export const destroyExpenseGoal = async (id: string) => {
  return prisma.expenseGoal.delete({ where: { id } });
};
