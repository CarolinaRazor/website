import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_workflow_items_assigned_to_role" AS ENUM('author', 'editor', 'other');
  CREATE TABLE "workflow_items_assigned_to" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"role" "enum_workflow_items_assigned_to_role" DEFAULT 'other' NOT NULL
  );

  DROP TABLE "workflow_items_rels" CASCADE;
  ALTER TABLE "workflow_items_assigned_to" ADD CONSTRAINT "workflow_items_assigned_to_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "workflow_items_assigned_to" ADD CONSTRAINT "workflow_items_assigned_to_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workflow_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "workflow_items_assigned_to_order_idx" ON "workflow_items_assigned_to" USING btree ("_order");
  CREATE INDEX "workflow_items_assigned_to_parent_id_idx" ON "workflow_items_assigned_to" USING btree ("_parent_id");
  CREATE INDEX "workflow_items_assigned_to_user_idx" ON "workflow_items_assigned_to" USING btree ("user_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "workflow_items_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );

  DROP TABLE "workflow_items_assigned_to" CASCADE;
  ALTER TABLE "workflow_items_rels" ADD CONSTRAINT "workflow_items_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."workflow_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workflow_items_rels" ADD CONSTRAINT "workflow_items_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "workflow_items_rels_order_idx" ON "workflow_items_rels" USING btree ("order");
  CREATE INDEX "workflow_items_rels_parent_idx" ON "workflow_items_rels" USING btree ("parent_id");
  CREATE INDEX "workflow_items_rels_path_idx" ON "workflow_items_rels" USING btree ("path");
  CREATE INDEX "workflow_items_rels_users_id_idx" ON "workflow_items_rels" USING btree ("users_id");
  DROP TYPE "public"."enum_workflow_items_assigned_to_role";`)
}
