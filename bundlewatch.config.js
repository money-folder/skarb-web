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
    trackBranches: ["develop"],
    defaultCompression: "gzip",
    commitSha: "$CI_COMMIT_SHA",
    repoBranchBase: "develop",
    repoOwner: "money-folder",
    repoName: "skarb-web",
    bundlewatch: {
      trackBranches: ["develop"],
    },
  },
};
