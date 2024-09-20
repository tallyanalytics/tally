import { defineConfig } from 'drizzle-kit';
import './envConfig.ts';

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './supabase/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.AUTH_DRIZZLE_URL!,
    },
    strict: true,
});