import { auth } from "@/auth";
import * as walletsRepository from "@/repositories/wallets";
import { ErrorCauses } from "@/types/errors";
import { ClientWalletDto, CreateWalletRequestDto } from "@/types/wallets";

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
    latestBalanceTs: w.history[0]?.date?.toLocaleString() || null,
    latestBalance: w.history[0]?.moneyAmount || null,
  }));
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
