import { jwtVerify, SignJWT } from "jose";

import { env } from "@/lib/env";

import { ACCESS_TOKEN_TTL_SEC, REFRESH_TOKEN_TTL_SEC } from "./consts";
import { AccessTokenPayload, RefreshTokenPayload } from "./types";

const ALG = "HS256";

const key = (secret: string) => new TextEncoder().encode(secret);

export const signAccessToken = (payload: AccessTokenPayload) =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SEC}s`)
    .sign(key(env.jwtAccessSecret));

export const signRefreshToken = (payload: RefreshTokenPayload) =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_TTL_SEC}s`)
    .sign(key(env.jwtRefreshSecret));

export const verifyAccessToken = async (
  token: string,
): Promise<AccessTokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, key(env.jwtAccessSecret), {
      algorithms: [ALG],
    });
    if (
      typeof payload.id !== "string" ||
      typeof payload.username !== "string"
    ) {
      return null;
    }
    return { id: payload.id, username: payload.username };
  } catch {
    return null;
  }
};

export const verifyRefreshToken = async (
  token: string,
): Promise<RefreshTokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, key(env.jwtRefreshSecret), {
      algorithms: [ALG],
    });
    if (typeof payload.id !== "string") {
      return null;
    }
    return { id: payload.id };
  } catch {
    return null;
  }
};
