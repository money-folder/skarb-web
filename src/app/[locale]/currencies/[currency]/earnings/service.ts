import { auth } from "@/auth";
import { ErrorCauses } from "@/shared/types/errors";
import * as earningsRepository from "./repository";
import {
  ClientEarningDto,
  CreateEarningRequestDto,
  FetchEarningsParams,
  FetchEarningsSumParams,
  UpdateEarningRequestDto,
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

export const updateUserCurrencyEarning = async (
  dto: UpdateEarningRequestDto,
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToUpdate = await verifyEarningOwnership(session.user.id, dto.id);
  if (!allowedToUpdate) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  const result = await earningsRepository.update(dto);
  return result;
};

export const verifyEarningOwnership = async (userId: string, id: string) => {
  const earning = await earningsRepository.findEarning(id);
  return !!earning && earning.ownerId === userId;
};

export const getUserCurrencyEarningsSum = async (
  currency: string,
  params?: FetchEarningsSumParams,
): Promise<number> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const sum = await earningsRepository.getSumByUserCurrency(
    session.user.id,
    currency,
    params,
  );

  return sum;
};

export const destroySelfEarning = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToDelete = await verifyEarningOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return earningsRepository.destroyEarning(id);
};
