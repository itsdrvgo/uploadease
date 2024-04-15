ALTER TABLE "user_organizations" RENAME TO "memberships";--> statement-breakpoint
ALTER TABLE "memberships" RENAME COLUMN "user_org_id" TO "id";--> statement-breakpoint
ALTER TABLE "memberships" DROP CONSTRAINT "user_organizations_user_org_id_unique";--> statement-breakpoint
ALTER TABLE "memberships" DROP CONSTRAINT "user_organizations_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "memberships" DROP CONSTRAINT "user_organizations_org_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "memberships" ADD CONSTRAINT "memberships_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "memberships" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_id_unique" UNIQUE("id");