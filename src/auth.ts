import { cookies } from "next/headers";
import { cache } from "react";

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/consts";
import { verifyAccessToken } from "@/lib/auth/tokens";
import { type Session } from "@/lib/auth/types";
import { prisma } from "@/prisma";

export type { Session };

/**
 * Reads the access token cookie, verifies it and loads the user.
 * Returns `null` for a missing/invalid/expired token, an unknown, deleted or
 * unverified user. Never throws and never sets cookies, so it is safe to call
 * from Server Components. Memoised per request.
 */
export const auth = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, username: true, isVerified: true, deletedAt: true },
  });
  if (!user || user.deletedAt || !user.isVerified) {
    return null;
  }

  return {
    user: { id: user.id, username: user.username, isVerified: user.isVerified },
  };
});
