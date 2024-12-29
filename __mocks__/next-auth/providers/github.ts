module.exports = {
  default: jest.fn(() => ({
    id: "github",
    name: "GitHub",
    type: "oauth",
    version: "2.0",
    scope: "read:user",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: "",
    requestTokenUrl: "",
    authorizationUrl: "",
    profileUrl: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile: (profile: any) => ({
      id: profile.id,
      name: profile.name,
      email: profile.email,
    }),
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  })),
};
