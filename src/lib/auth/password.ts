import { compare, hash } from "bcryptjs";

import { env } from "@/lib/env";

export const hashPassword = (plain: string) =>
  hash(plain, env.passwordSaltRounds);

export const verifyPassword = async (plain: string, passwordHash: string) => {
  try {
    return await compare(plain, passwordHash);
  } catch {
    return false;
  }
};
