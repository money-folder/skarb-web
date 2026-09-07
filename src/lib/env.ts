const required = (name: string, minLength = 0) => {
  const value = process.env[name];
  if (!value || value.length < minLength) {
    throw new Error(
      `Missing or too short env var ${name} (min ${minLength} chars)`,
    );
  }
  return value;
};

export const env = {
  get jwtAccessSecret() {
    return required("JWT_ACCESS_SECRET", 32);
  },
  get jwtRefreshSecret() {
    return required("JWT_REFRESH_SECRET", 32);
  },
  get passwordSaltRounds() {
    const n = Number(process.env.PASSWORD_SALT_ROUNDS);
    return Number.isInteger(n) && n >= 4 && n <= 31 ? n : 12;
  },
};
