import { auth } from "@/auth";
import { ErrorCauses } from "@/shared/types/errors";
import * as earningsRepository from "./repository";
import {
  ClientEarningDto,
  CreateEarningRequestDto,
  FetchEarningsParams,
} from "./types";

export const getUserCurrencyEarningsTypes = async (
  currency: string,
): Promise<string[]> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const types = await earningsRepository.getEarningsTypesByUserCurrency(
    session.user.id,
    currency,
  );

  if (!types) {
    throw new Error(`Earnings types for currency ${currency} were not found!`, {
      cause: ErrorCauses.NOT_FOUND,
    });
  }

  return types.map(({ type }) => type);
};

export const getUserCurrencyEarnings = async (
  currency: string,
  params: FetchEarningsParams,
): Promise<{ earnings: ClientEarningDto[]; total: number }> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const result = await earningsRepository.findByUserCurrency(
    session.user.id,
    currency,
    params,
  );

  if (!result) {
    throw new Error(`Earnings for currency ${currency} were not found!`, {
      cause: ErrorCauses.NOT_FOUND,
    });
  }

  return result;
};

export const createUserCurrencyEarning = async (
  dto: CreateEarningRequestDto,
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const result = await earningsRepository.create({
    ...dto,
    ownerId: session.user.id,
  });

  return result;
};
