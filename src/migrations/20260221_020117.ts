import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_workflow_items_status" AS ENUM('idea', 'writing', 'ready-edit', 'editing', 'uploading', 'ready-publish', 'published');
  CREATE TYPE "public"."enum_workflow_items_priority" AS ENUM('low', 'medium', 'high', 'urgent');
  CREATE TABLE "workflow_items_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "workflow_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"status" "enum_workflow_items_status" DEFAULT 'idea' NOT NULL,
  	"linked_post_id" integer,
  	"created_by_id" integer NOT NULL,
  	"priority" "enum_workflow_items_priority" DEFAULT 'medium',
  	"due_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "workflow_items_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "workflow_items_id" integer;
  ALTER TABLE "workflow_items_links" ADD CONSTRAINT "workflow_items_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workflow_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workflow_items" ADD CONSTRAINT "workflow_items_linked_post_id_posts_id_fk" FOREIGN KEY ("linked_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workflow_items" ADD CONSTRAINT "workflow_items_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workflow_items_rels" ADD CONSTRAINT "workflow_items_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."workflow_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workflow_items_rels" ADD CONSTRAINT "workflow_items_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "workflow_items_links_order_idx" ON "workflow_items_links" USING btree ("_order");
  CREATE INDEX "workflow_items_links_parent_id_idx" ON "workflow_items_links" USING btree ("_parent_id");
  CREATE INDEX "workflow_items_linked_post_idx" ON "workflow_items" USING btree ("linked_post_id");
  CREATE INDEX "workflow_items_created_by_idx" ON "workflow_items" USING btree ("created_by_id");
  CREATE INDEX "workflow_items_updated_at_idx" ON "workflow_items" USING btree ("updated_at");
  CREATE INDEX "workflow_items_created_at_idx" ON "workflow_items" USING btree ("created_at");
  CREATE INDEX "workflow_items_rels_order_idx" ON "workflow_items_rels" USING btree ("order");
  CREATE INDEX "workflow_items_rels_parent_idx" ON "workflow_items_rels" USING btree ("parent_id");
  CREATE INDEX "workflow_items_rels_path_idx" ON "workflow_items_rels" USING btree ("path");
  CREATE INDEX "workflow_items_rels_users_id_idx" ON "workflow_items_rels" USING btree ("users_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_workflow_items_fk" FOREIGN KEY ("workflow_items_id") REFERENCES "public"."workflow_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_workflow_items_id_idx" ON "payload_locked_documents_rels" USING btree ("workflow_items_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "workflow_items_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "workflow_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "workflow_items_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "workflow_items_links" CASCADE;
  DROP TABLE "workflow_items" CASCADE;
  DROP TABLE "workflow_items_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_workflow_items_fk";
  
  DROP INDEX "payload_locked_documents_rels_workflow_items_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "workflow_items_id";
  DROP TYPE "public"."enum_workflow_items_status";
  DROP TYPE "public"."enum_workflow_items_priority";`)
}
