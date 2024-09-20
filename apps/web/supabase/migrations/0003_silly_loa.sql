ALTER TABLE "pageView" ALTER COLUMN "sessionId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "site" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "siteSession" ALTER COLUMN "visitorId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "siteSession" DROP COLUMN IF EXISTS "pageViews";