export type AccessTokenPayload = {
  id: string;
  username: string;
};

export type RefreshTokenPayload = {
  id: string;
};

export type SessionUser = {
  id: string;
  username: string;
  isVerified: boolean;
};

export type Session = {
  user: SessionUser;
};
