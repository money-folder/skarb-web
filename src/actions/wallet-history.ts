"use server";

import { revalidatePath } from "next/cache";

import { CreateWhistoryRequestDto } from "@/types/wallets-history";
import {
  archiveSelfWhistory,
  createWhistory,
  destroySelfWhistory,
  getCurrentUserWalletHistory,
  unarchiveSelfWhistory,
} from "@/services/wallets-history";

import { createWhistoryRequstSchema } from "../app/wallets/[id]/validation";

export const fetchWalletHistory = async (walletId: string) => {
  try {
    const walletHistory = await getCurrentUserWalletHistory(walletId);
    return { success: true, data: walletHistory };
  } catch (error: any) {
    console.error(error);
    return { success: false, data: null, error };
  }
};

export async function create(dto: CreateWhistoryRequestDto) {
  try {
    const validationResult = createWhistoryRequstSchema.safeParse(dto);
    if (validationResult.error) {
      console.error("Create whistory validation failed", dto);
      throw new Error(
        "Create whistory validation failed",
        validationResult.error
      );
    }

    await createWhistory(dto);
    await revalidatePath(`/wallets/${dto.walletId}`);

    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error };
  }
}

export const archive = async (id: string) => {
  try {
    await archiveSelfWhistory(id);
    await revalidatePath(`/wallets/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error };
  }
};

export const unarchive = async (id: string) => {
  try {
    await unarchiveSelfWhistory(id);
    await revalidatePath(`/wallets/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error };
  }
};

export const destroy = async (id: string) => {
  try {
    await destroySelfWhistory(id);
    await revalidatePath(`/wallets/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error };
  }
};
