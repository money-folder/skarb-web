"use server";

import { revalidatePath } from "next/cache";

import { createCurrentUserWallet } from "@/services/wallets";

export async function create(name: string, currency: string) {
  await createCurrentUserWallet({ name, currency });
  await revalidatePath("/wallets");
}
