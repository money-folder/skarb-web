import { auth } from "@/auth";
import * as walletsRepository from "@/app/[locale]/wallets/repository";
import { ErrorCauses } from "@/types/errors";
import { ClientWalletDto, CreateWalletRequestDto } from "@/types/wallets";
import { calculateDateDifference } from "@/utils/time-utils";

const verifyWalletOwnership = async (userId: string, walletId: string) => {
  const wallet = await walletsRepository.findById(walletId);
  return !!wallet && wallet.ownerId === userId;
};

export const getCurrentUserWallets = async (): Promise<ClientWalletDto[]> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const wallets = await walletsRepository.findByUser(session.user.id);

  return wallets.map((w) => ({
    ...w,
    changes:
      w.history[0] && w.history[1]
        ? (w.history[0].moneyAmount - w.history[1].moneyAmount) /
          w.history[1].moneyAmount
        : null,
    changesAbs:
      w.history[0] && w.history[1]
        ? w.history[0].moneyAmount - w.history[1].moneyAmount
        : null,
    sinceLatestBallanceTs: w.history[0]?.date
      ? calculateDateDifference(w.history[0].date, new Date())
      : null,
    latestWhistory: w.history[0] || null,
  }));
};

export const getCurrentUserWallet = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const wallet = await walletsRepository.findOne({
    id,
    ownerId: session.user.id,
  });

  if (!wallet) {
    throw new Error("Wallet was not found!", {
      cause: ErrorCauses.NOT_FOUND,
    });
  }

  return wallet;
};

export const createCurrentUserWallet = async (dto: CreateWalletRequestDto) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const result = await walletsRepository.create({
    ...dto,
    ownerId: session.user.id,
  });

  return result;
};

export const archiveSelfWallet = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToDelete = await verifyWalletOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return await walletsRepository.archive(id);
};

export const unarchiveSelfWallet = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToUndelete = await verifyWalletOwnership(session.user.id, id);
  if (!allowedToUndelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return await walletsRepository.unarchive(id);
};

export const destroySelfWallet = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
  }

  const allowedToDelete = await verifyWalletOwnership(session.user.id, id);
  if (!allowedToDelete) {
    throw new Error("Forbidden!", { cause: ErrorCauses.FORBIDDEN });
  }

  return await walletsRepository.destroy(id);
};
