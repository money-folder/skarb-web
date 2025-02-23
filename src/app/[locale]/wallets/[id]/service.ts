import * as whistoryRepository from "@/app/[locale]/wallets/[id]/repository";
import {
  CreateWhistoryRequestDto,
  UpdateWhistoryRequestDto,
} from "@/app/[locale]/wallets/[id]/types";
import * as walletsRepository from "@/app/[locale]/wallets/repository";
import { auth } from "@/auth";
import { ErrorCauses } from "@/shared/types/errors";

import { FetchWhistoryParams } from "../types";

export const verifyWhistoryOwnership = async (
  userId: string,
  whistoryId: string,
) => {
  const wallet = await whistoryRepository.findWallet(whistoryId);
  return !!wallet && wallet.ownerId === userId;
};

export const getWalletHistory = async (walletId: string) => {
  return whistoryRepository.findByWallet(walletId);
};

export const getCurrentUserWhistory = async (
  walletId: string,
  params?: FetchWhistoryParams,
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const walletHistory = await whistoryRepository.findUserWallet(
    session.user.id,
    walletId,
    params,
  );

  if (!walletHistory) {
    throw new Error("Wallet history was not found!", {
      cause: ErrorCauses.NOT_FOUND,
    });
  }

  const whistory = walletHistory.map((wh, i, array) => ({
    ...wh,
    changes: array[i - 1]
      ? (array[i].moneyAmount - array[i - 1].moneyAmount) /
        array[i - 1].moneyAmount
      : null,
    changesAbs: array[i - 1]
      ? array[i].moneyAmount - array[i - 1].moneyAmount
      : null,
  }));

  const sums = whistory.reduce(
    (acc, item) => {
      if (item.changesAbs && item.changesAbs < 0) {
        return { ...acc, decreasesSum: acc.decreasesSum + item.changesAbs };
      } else if (item.changesAbs) {
        return { ...acc, increasesSum: acc.increasesSum + item.changesAbs };
      }

      return acc;
    },
    { increasesSum: 0, decreasesSum: 0 },
  );

  const increasesDecreasesDiff = sums.increasesSum + sums.decreasesSum;

  return { whistory, increasesDecreasesDiff, ...sums };
};

export const createWhistory = async (dto: CreateWhistoryRequestDto) => {
  return whistoryRepository.create({
    ...dto,
    date: new Date(dto.date),
  });
};

export const updateWhistory = async (dto: UpdateWhistoryRequestDto) => {
  return whistoryRepository.update(dto);
};

export const duplicateWhistory = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const target = await whistoryRepository.findById(id);
  if (!target) {
    throw new Error("Target wallet history entry was not found!", {
      cause: ErrorCauses.NOT_FOUND,
    });
  }

  const targetWallet = await walletsRepository.findById(target.walletId);
  if (targetWallet?.ownerId !== session.user.id) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return whistoryRepository.create({
    moneyAmount: target?.moneyAmount,
    walletId: target.walletId,
    date: new Date(),
  });
};

export const archiveSelfWhistory = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToDelete = await verifyWhistoryOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return whistoryRepository.archive(id);
};

export const unarchiveSelfWhistory = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToUndelete = await verifyWhistoryOwnership(session.user.id, id);
  if (!allowedToUndelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return whistoryRepository.unarchive(id);
};

export const destroySelfWhistory = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToDelete = await verifyWhistoryOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return whistoryRepository.destroy(id);
};
