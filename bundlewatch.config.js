module.exports = {
  files: [
    {
      path: ".next/static/chunks/*.js",
      maxSize: "500kb",
    },
    {
      path: ".next/static/css/*.css",
      maxSize: "100kb",
    },
    {
      path: ".next/server/pages/*.js",
      maxSize: "500kb",
    },
  ],
  ci: {
    repoBranchBase: "develop",
    trackBranches: ["develop"],
  },
};
