/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  env: {
    AUTH_SECRET: "API_KEY_HERE",
    AUTH_GITHUB_ID:"API_KEY_HERE",
    AUTH_GITHUB_SECRET:"API_KEY_HERE",
    AUTH_DRIZZLE_URL:"API_KEY_HERE",
  },
};
