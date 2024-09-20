import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
// import './envConfig.ts';

export default {
    providers: [Github({
        clientId: process.env.AUTH_GITHUB_ID!,
        clientSecret: process.env.AUTH_GITHUB_SECRET!,
    })],
    trustHost: true
} as NextAuthConfig;