import { prisma } from "@/prisma";

import { CreateExpenseGoalDto } from "./types";

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
