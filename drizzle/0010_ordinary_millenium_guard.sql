ALTER TABLE "templates" ALTER COLUMN "tags" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "tags" SET DEFAULT '[]';