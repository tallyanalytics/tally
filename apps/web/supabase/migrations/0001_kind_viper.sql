ALTER TABLE "visitor" RENAME COLUMN "userId" TO "hashId";--> statement-breakpoint
ALTER TABLE "visitor" DROP CONSTRAINT "visitor_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "site" ALTER COLUMN "salt" SET DEFAULT '30892d45a1b29f4781928d5271b664fdac774dd4e262625ce5d34d1454ee7c88f848293a90a9d390eee800fbafe780a0b4e2446899458db5c48dc135479081fbaa20249069773802b19f4e7e2f66a18bf31e8dd3ae772d1757c43dc16ff6dc56f1360a7e7aa5f7c81705b1f0bde7376bfa66d05cf28a959c0319f7808128a79ded346e9601ad700575f0231628efb8f2261837461da85b93aca578327471bd57a3c2729a05703aaf08d8fbbba26dc507b3fe73595bf07aa4848ea0f7e0e6aecb20af58ca031259cf69dd4eefd31bd9a4b089672c08ad015214d070ee0490d2e02d277b6a8dfff6fa206fc7f0b0f34eb99594cd92859817e25ae40e943caf3c08';--> statement-breakpoint
ALTER TABLE "visitor" ALTER COLUMN "hashId" SET NOT NULL;