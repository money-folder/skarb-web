"use server";

import { revalidatePath } from "next/cache";

import { CreateWhistoryRequestDto } from "@/types/wallets-history";
import {
  archiveSelfWhistory,
  createWhistory,
  destroySelfWhistory,
  unarchiveSelfWhistory,
} from "@/services/wallets-history";

import { createWhistoryRequstSchema } from "./validation";

export async function create(dto: CreateWhistoryRequestDto) {
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
}

export const archive = async (id: string) => {
  try {
    await archiveSelfWhistory(id);
    await revalidatePath(`/wallets/${id}`);
  } catch (error: any) {
    console.error(error);
    return { success: false, data: null, error };
  }
};

export const unarchive = async (id: string) => {
  try {
    await unarchiveSelfWhistory(id);
    await revalidatePath(`/wallets/${id}`);
  } catch (error: any) {
    console.error(error);
    return { success: false, data: null, error };
  }
};

export const destroy = async (id: string) => {
  try {
    await destroySelfWhistory(id);
    await revalidatePath(`/wallets/${id}`);
  } catch (error: any) {
    console.error(error);
    return { success: false, data: null, error };
  }
};
