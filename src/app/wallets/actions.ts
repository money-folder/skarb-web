"use server";

import { revalidatePath } from "next/cache";

import {
  archiveSelfWallet,
  createCurrentUserWallet,
  unarchiveSelfWallet,
} from "@/services/wallets";
import { CreateWalletRequestDto } from "@/types/wallets";

import { createWalletRequestSchema } from "./validation";

export async function create(dto: CreateWalletRequestDto) {
  const validationResult = createWalletRequestSchema.safeParse(dto);
  if (validationResult.error) {
    throw new Error("Create wallet validation failed!", validationResult.error);
  }

  await createCurrentUserWallet(dto);
  await revalidatePath("/wallets");
}

export async function archive(id: string) {
  try {
    await archiveSelfWallet(id);
    await revalidatePath("/wallets");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, data: null, error };
  }
}

export async function unrchive(id: string) {
  try {
    await unarchiveSelfWallet(id);
    await revalidatePath("/wallets");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, data: null, error };
  }
}
