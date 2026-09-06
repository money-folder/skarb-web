import * as expenseGoalsRepository from "@/app/[locale]/currencies/[currency]/expense-goals/repository";

import { auth } from "@/auth";
import { ErrorCauses } from "@/shared/types/errors";
import { ClientExpenseGoalDto, CreateExpenseGoalRequestDto } from "./types";

export const createUserCurrencyExpenseGoal = async (
  dto: CreateExpenseGoalRequestDto,
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const result = await expenseGoalsRepository.createGoal({
    ...dto,
    ownerId: session.user.id,
  });

  return result;
};

export const getUserCurrencyExpenseGoals = async (
  currency: string,
  fromTs?: number,
): Promise<ClientExpenseGoalDto[]> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const expenseGoals = await expenseGoalsRepository.findGoalsByUserCurrency(
    session.user.id,
    currency,
    fromTs,
  );

  if (!expenseGoals) {
    throw new Error(`Expense goals for currency ${currency} were not found!`, {
      cause: ErrorCauses.NOT_FOUND,
    });
  }

  return expenseGoals;
};

export const verifyExpenseGoalOwnership = async (
  userId: string,
  id: string,
) => {
  const expenseGoal = await expenseGoalsRepository.findExpenseGoal(id);
  return !!expenseGoal && expenseGoal.ownerId === userId;
};

export const destroySelfExpenseGoal = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToDelete = await verifyExpenseGoalOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return expenseGoalsRepository.destroyExpenseGoal(id);
};
