import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import './envConfig.ts';

const client = postgres(process.env.AUTH_DRIZZLE_URL!);
export const db = drizzle(client);