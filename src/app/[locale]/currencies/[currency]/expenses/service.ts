import * as expensesRepository from "@/app/[locale]/currencies/[currency]/expenses/repository";

import { auth } from "@/auth";
import { ErrorCauses } from "@/shared/types/errors";
import { ClientExpenseDto, CreateExpenseRequestDto } from "./types";

export const getUserCurrencyExpensesTypes = async (
  currency: string,
): Promise<string[]> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const types = await expensesRepository.getExpensesTypesByUserCurrency(
    session.user.id,
    currency,
  );

  if (!types) {
    throw new Error(`Expenses types for currency ${currency} were not found!`, {
      cause: ErrorCauses.NOT_FOUND,
    });
  }

  return types.map(({ type }) => type);
};

export const getUserCurrencyExpenses = async (
  currency: string,
): Promise<ClientExpenseDto[]> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const expenses = await expensesRepository.findByUserCurrency(
    session.user.id,
    currency,
  );

  if (!expenses) {
    throw new Error(`Expenses for currency ${currency} were not found!`, {
      cause: ErrorCauses.NOT_FOUND,
    });
  }

  return expenses;
};

export const createUserCurrencyExpense = async (
  dto: CreateExpenseRequestDto,
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const result = await expensesRepository.create({
    ...dto,
    ownerId: session.user.id,
  });

  return result;
};

export const verifyExpenseOwnership = async (userId: string, id: string) => {
  const expense = await expensesRepository.findExpense(id);
  return !!expense && expense.ownerId === userId;
};

export const destroySelfExpense = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToDelete = await verifyExpenseOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return expensesRepository.destroyExpense(id);
};
