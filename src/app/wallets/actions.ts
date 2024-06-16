"use server";

import { revalidatePath } from "next/cache";

import { createCurrentUserWallet } from "@/services/wallets";
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
