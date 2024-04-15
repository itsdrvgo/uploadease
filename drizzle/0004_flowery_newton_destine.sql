ALTER TABLE "organizations" DROP CONSTRAINT "organizations_invite_code_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "creator_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "invite_code_idx";--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "features" json DEFAULT '{"isInvitePaused":false}'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "member_count" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "id_invite_code_idx" ON "organizations" ("id","invite_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creator_idx" ON "organizations" ("creator_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invite_code_idx" ON "organizations" ("invite_code");--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN IF EXISTS "updated_at";