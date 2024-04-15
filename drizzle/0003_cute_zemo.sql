ALTER TABLE "organizations" DROP CONSTRAINT "organizations_name_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "invite_code" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invite_code_idx" ON "organizations" ("invite_code");--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_invite_code_unique" UNIQUE("invite_code");