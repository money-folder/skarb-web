'use server';

import { revalidatePath } from 'next/cache';

import {
  archiveSelfWallet,
  createCurrentUserWallet,
  destroySelfWallet,
  getCurrentUserWallet,
  getCurrentUserWallets,
  unarchiveSelfWallet,
} from '@/services/wallets';
import { CreateWalletRequestDto } from '@/types/wallets';
import { createWalletRequestSchema } from '@/app/[locale]/wallets/validation';

export const fetchCurrentUserWallets = async () => {
  try {
    const wallets = await getCurrentUserWallets();
    return { success: true, data: wallets };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
};

export const fetchWallet = async (walletId: string) => {
  try {
    const wallet = await getCurrentUserWallet(walletId);
    return { success: true, data: wallet };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
};

export async function create(dto: CreateWalletRequestDto) {
  const validationResult = createWalletRequestSchema.safeParse(dto);
  if (validationResult.error) {
    throw new Error('Create wallet validation failed!', validationResult.error);
  }

  await createCurrentUserWallet(dto);
  await revalidatePath('/wallets');
}

export async function archive(id: string) {
  try {
    await archiveSelfWallet(id);
    await revalidatePath('/wallets');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
}

export async function unrchive(id: string) {
  try {
    await unarchiveSelfWallet(id);
    await revalidatePath('/wallets');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
}

export async function destroy(id: string) {
  try {
    await destroySelfWallet(id);
    await revalidatePath('/wallets');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error };
  }
}
