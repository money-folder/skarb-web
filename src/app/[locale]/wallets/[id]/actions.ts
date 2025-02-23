"use server";

import { revalidatePath } from "next/cache";

import {
  archiveSelfWhistory,
  createWhistory,
  destroySelfWhistory,
  duplicateWhistory,
  getCurrentUserWhistory,
  unarchiveSelfWhistory,
  updateWhistory,
} from "@/app/[locale]/wallets/[id]/service";
import {
  CreateWhistoryRequestDto,
  UpdateWhistoryRequestDto,
} from "@/app/[locale]/wallets/[id]/types";
import {
  createWhistoryRequstSchema,
  updateWhistoryRequstSchema,
} from "@/app/[locale]/wallets/[id]/validation";

import { FetchWhistoryParams } from "../types";

export const fetchWalletHistory = async (
  walletId: string,
  params?: FetchWhistoryParams,
) => {
  try {
    const walletHistory = await getCurrentUserWhistory(walletId, params);
    return { success: true, data: walletHistory };
  } catch (error) {
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
        validationResult.error,
      );
    }

    await createWhistory(dto);
    revalidatePath(`/wallets/${dto.walletId}`);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
}

export async function update(dto: UpdateWhistoryRequestDto) {
  try {
    const validationResult = updateWhistoryRequstSchema.safeParse(dto);
    if (validationResult.error) {
      console.error("Update whistory validation failed", dto);
      throw new Error(
        "Update whistory validation failed",
        validationResult.error,
      );
    }

    await updateWhistory(dto);
    revalidatePath(`/wallets/${dto.walletId}`);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
}

export async function duplicate(id: string, walletId: string) {
  try {
    await duplicateWhistory(id);
    revalidatePath(`/wallets/${walletId}`);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
}

export const archive = async (id: string) => {
  try {
    await archiveSelfWhistory(id);
    revalidatePath(`/wallets/${id}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export const unarchive = async (id: string) => {
  try {
    await unarchiveSelfWhistory(id);
    revalidatePath(`/wallets/${id}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export const destroy = async (id: string) => {
  try {
    await destroySelfWhistory(id);
    revalidatePath(`/wallets/${id}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};
