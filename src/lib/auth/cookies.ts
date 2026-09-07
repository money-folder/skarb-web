import { cookies } from "next/headers";

import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_TTL_SEC,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_TTL_SEC,
} from "./consts";

const baseOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export const setAuthCookies = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseOptions,
    maxAge: ACCESS_TOKEN_TTL_SEC,
  });
  store.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...baseOptions,
    maxAge: REFRESH_TOKEN_TTL_SEC,
  });
};

export const clearAuthCookies = async () => {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, "", { ...baseOptions, maxAge: 0 });
  store.set(REFRESH_TOKEN_COOKIE, "", { ...baseOptions, maxAge: 0 });
};
