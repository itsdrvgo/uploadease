ALTER TABLE "organizations" DROP CONSTRAINT "organizations_org_code_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "org_code_idx";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN IF EXISTS "org_code";