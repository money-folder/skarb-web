import { auth } from "@/auth";
import { CreateWhistoryRequestDto } from "@/types/wallets-history";
import * as whistoryRepository from "@/repositories/wallets-history";
import * as walletsRepository from "@/repositories/wallets";
import { ErrorCauses } from "@/types/errors";
import { FetchWalletHistoryParams } from "@/types/wallets";

const verifyWalletOwnership = async (userId: string, whistoryId: string) => {
  const wallet = await whistoryRepository.findWallet(whistoryId);
  return !!wallet && wallet.ownerId === userId;
};

export const getWalletHistory = async (walletId: string) => {
  return await whistoryRepository.findByWallet(walletId);
};

export const getCurrentUserWalletHistory = async (
  walletId: string,
  params?: FetchWalletHistoryParams
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const walletHistory = await whistoryRepository.findUserWallet(
    session.user.id,
    walletId,
    params
  );

  return walletHistory.map((wh, i, array) => ({
    ...wh,
    changes: array[i - 1]
      ? (array[i].moneyAmount - array[i - 1].moneyAmount) /
        array[i - 1].moneyAmount
      : null,
  }));
};

export const createWhistory = async (dto: CreateWhistoryRequestDto) => {
  return await whistoryRepository.create({
    ...dto,
    date: new Date(dto.date),
  });
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

  return await whistoryRepository.create({
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

  const allowedToDelete = await verifyWalletOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return await whistoryRepository.archive(id);
};

export const unarchiveSelfWhistory = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToUndelete = await verifyWalletOwnership(session.user.id, id);
  if (!allowedToUndelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return await whistoryRepository.unarchive(id);
};

export const destroySelfWhistory = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToDelete = await verifyWalletOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return await whistoryRepository.destroy(id);
};
