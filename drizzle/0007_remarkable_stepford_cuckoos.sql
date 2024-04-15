CREATE TABLE IF NOT EXISTS "templates" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"thumbnail" text NOT NULL,
	"video_url" text NOT NULL,
	"category_id" integer NOT NULL,
	"tags" text NOT NULL,
	CONSTRAINT "templates_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "videos" DROP COLUMN IF EXISTS "language";--> statement-breakpoint
ALTER TABLE "videos" DROP COLUMN IF EXISTS "audio_language";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "templates" ADD CONSTRAINT "templates_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
