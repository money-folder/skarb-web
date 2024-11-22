module.exports = {
  files: [
    {
      path: ".next/static/chunks/*.js",
      maxSize: "100kb",
    },
    {
      path: ".next/static/css/*.css",
      maxSize: "20kb",
    },
    {
      path: ".next/server/pages/*.js",
      maxSize: "100kb",
    },
  ],
  ci: {
    repoBranchBase: "develop",
    trackBranches: ["develop"],
  },
};
