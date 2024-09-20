ALTER TABLE "site" ALTER COLUMN "salt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "siteSession" ADD COLUMN "startedAt" timestamp DEFAULT now() NOT NULL;