"use server";

import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/consts";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth/cookies";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth/tokens";
import { prisma } from "@/prisma";

import { AuthActionResult, AuthFormValues } from "./types";
import { authFormSchema } from "./validation";

const userSelect = {
  id: true,
  username: true,
  passwordHash: true,
  isVerified: true,
  deletedAt: true,
} satisfies Prisma.UserSelect;

type AuthUser = Prisma.UserGetPayload<{ select: typeof userSelect }>;

const isActive = (user: AuthUser | null): user is AuthUser =>
  !!user && user.isVerified && !user.deletedAt;

const issueTokens = async (user: AuthUser) => {
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken({ id: user.id, username: user.username }),
    signRefreshToken({ id: user.id }),
  ]);
  await setAuthCookies({ accessToken, refreshToken });
};

// A real bcrypt hash compared against when the username is unknown, so a
// login attempt takes the same time whether or not the user exists.
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hashPassword("dummy-password"));

export const register = async (
  dto: AuthFormValues,
): Promise<AuthActionResult> => {
  const parsed = authFormSchema.safeParse(dto);
  if (!parsed.success) {
    return { success: false, error: "VALIDATION" };
  }

  try {
    const { username, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (existing) {
      return { success: false, error: "USERNAME_TAKEN" };
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.create({
      data: { username, passwordHash, isVerified: false },
    });

    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: false, error: "USERNAME_TAKEN" };
    }
    console.error(error);
    return { success: false, error: "UNKNOWN" };
  }
};

export const login = async (dto: AuthFormValues): Promise<AuthActionResult> => {
  const parsed = authFormSchema.safeParse(dto);
  if (!parsed.success) {
    return { success: false, error: "VALIDATION" };
  }

  try {
    const { username, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { username },
      select: userSelect,
    });

    const passwordOk = await verifyPassword(
      password,
      user?.passwordHash ?? (await getDummyHash()),
    );

    if (!passwordOk || !isActive(user)) {
      return { success: false, error: "INVALID_CREDENTIALS" };
    }

    await issueTokens(user);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "UNKNOWN" };
  }
};

export const refresh = async (): Promise<AuthActionResult> => {
  try {
    const token = (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value;
    const payload = token ? await verifyRefreshToken(token) : null;

    const user = payload
      ? await prisma.user.findUnique({
          where: { id: payload.id },
          select: userSelect,
        })
      : null;

    if (!isActive(user)) {
      await clearAuthCookies();
      return { success: false, error: "INVALID_CREDENTIALS" };
    }

    await issueTokens(user);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "UNKNOWN" };
  }
};

export const logout = async () => {
  await clearAuthCookies();
  redirect("/");
};
