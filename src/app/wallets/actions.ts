"use server";

import { revalidatePath } from "next/cache";

import { createCurrentUserWallet } from "@/services/wallets";
import { CreateWalletRequestDto } from "@/types/wallets";

import { createWalletRequestSchema } from "./validation";

export async function create(dto: CreateWalletRequestDto) {
  const result = createWalletRequestSchema.safeParse(dto);
  if (result.error) {
    throw new Error("Create wallet validation failed!", result.error);
  }

  await createCurrentUserWallet(dto);
  await revalidatePath("/wallets");
}
