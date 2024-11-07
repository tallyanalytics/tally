import {
    boolean,
    char,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccountType } from "next-auth/adapters"
import postgres from "postgres"
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator"

import { randomBytes, randomUUID } from "crypto"

const pool = postgres(process.env.AUTH_DRIZZLE_URL!, { max: 1 })

export const db = drizzle(pool)

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
})

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
)

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => ({
        compositePK: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
        }),
    })
)

interface PageView {
    search?: string,
    path: string,
    date: Date,
    referrer?: string
}

export const site = pgTable("site", {
    id: uuid("id")
        .primaryKey()
        .defaultRandom()
        .notNull(),
    userId: text("userId").notNull().references(() => users.id),
    name: text("name").notNull(),
    domain: text("domain").notNull(),
    salt: text("salt").notNull().$defaultFn(() => randomBytes(256).toString('hex')),
    token: text("token").notNull().$defaultFn(() => randomUUID()),
})

export type InsertSite = typeof site.$inferInsert;
export type SelectSite = typeof site.$inferSelect;

export const siteSession = pgTable(
    "siteSession",
    {
        id: uuid("id")
            .primaryKey()
            .defaultRandom()
            .notNull(),
        visitorId: uuid("visitorId").notNull().references(() => visitor.id),
        siteId: uuid("siteId").references(() => site.id),
        startedAt: timestamp("startedAt", { mode: "date" }).notNull().defaultNow(),
        updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
        duration: integer("duration").notNull().default(0),
        device: text("device").notNull(),
    },
)

export type InsertSiteSession = typeof siteSession.$inferInsert;
export type SelectSiteSession = typeof siteSession.$inferSelect;

export const permissionEnum = pgEnum('permission', ['owner', 'read']);

export const permissions = pgTable("permissions", {
    id: uuid("id")
        .primaryKey()
        .defaultRandom()
        .notNull(),
    userId: text("userId").notNull().references(() => users.id),
    permission: permissionEnum("permission").notNull(),
})

export type InsertPermissions = typeof permissions.$inferInsert;
export type SelectPermissions = typeof permissions.$inferSelect;

export const visitor = pgTable("visitor", {
    id: uuid("id")
        .primaryKey()
        .defaultRandom()
        .notNull(),
    hashId: text("hashId").notNull(),
    country: char("country"),
    referrer: text("referrer"),
    firstVisit: timestamp("firstVisit", { mode: "date" }).notNull().defaultNow(),
    lastVisit: timestamp("lastVisit", { mode: "date" }).notNull().defaultNow(),
    name: text("name").$defaultFn(() => uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], style: 'capital', separator: " " })),
})

export type InsertVisitor = typeof visitor.$inferInsert;
export type SelectVisitor = typeof visitor.$inferSelect;

export const pageView = pgTable("pageView", {
    id: uuid("id")
        .primaryKey()
        .defaultRandom()
        .notNull(),
    search: text("search"),
    path: text("path"),
    date: timestamp("date", { mode: "date" }).notNull().defaultNow(),
    referrer: text("referrer"),
    sessionId: uuid("sessionId").notNull().references(() => siteSession.id),
})

export type InsertPageView = typeof pageView.$inferInsert;
export type SelectPageView = typeof pageView.$inferSelect;