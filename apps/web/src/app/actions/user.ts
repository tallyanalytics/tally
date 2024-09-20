"use server"

import { eq, sql } from 'drizzle-orm';
import { auth } from '../../../auth';
import { db, users } from "../../db/schema";
