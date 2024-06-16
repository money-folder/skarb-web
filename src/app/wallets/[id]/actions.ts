"use server";

import { revalidatePath } from "next/cache";

import { CreateWhistoryRequestDto } from "@/types/wallets-history";
import { createWalletHistory } from "@/services/wallets-history";

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

  await createWalletHistory(dto);
  await revalidatePath(`/wallets/${dto.walletId}`);
}
