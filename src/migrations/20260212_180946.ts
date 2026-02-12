import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_authors_links_icon" AS ENUM('twitter', 'linkedin', 'github', 'mail', 'globe', 'instagram', 'facebook', 'youtube');
  CREATE TYPE "public"."enum__authors_v_version_links_icon" AS ENUM('twitter', 'linkedin', 'github', 'mail', 'globe', 'instagram', 'facebook', 'youtube');
  CREATE TABLE "pages_blocks_personnel_collection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_personnel_collection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "authors_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"icon" "enum_authors_links_icon"
  );
  
  CREATE TABLE "authors_populated_authors_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "_authors_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"icon" "enum__authors_v_version_links_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_authors_v_version_populated_authors_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "forms_blocks_radio_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_radio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"other_option" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "navigation_header_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "navigation_header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "pages_blocks_personnel_collection" ADD CONSTRAINT "pages_blocks_personnel_collection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_personnel_collection" ADD CONSTRAINT "_pages_v_blocks_personnel_collection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors_links" ADD CONSTRAINT "authors_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors_populated_authors_links" ADD CONSTRAINT "authors_populated_authors_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors_populated_authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_authors_v_version_links" ADD CONSTRAINT "_authors_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_authors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_authors_v_version_populated_authors_links" ADD CONSTRAINT "_authors_v_version_populated_authors_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_authors_v_version_populated_authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio_options" ADD CONSTRAINT "forms_blocks_radio_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_radio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio" ADD CONSTRAINT "forms_blocks_radio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_links" ADD CONSTRAINT "navigation_header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_personnel_collection_order_idx" ON "pages_blocks_personnel_collection" USING btree ("_order");
  CREATE INDEX "pages_blocks_personnel_collection_parent_id_idx" ON "pages_blocks_personnel_collection" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_personnel_collection_path_idx" ON "pages_blocks_personnel_collection" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_personnel_collection_order_idx" ON "_pages_v_blocks_personnel_collection" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_personnel_collection_parent_id_idx" ON "_pages_v_blocks_personnel_collection" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_personnel_collection_path_idx" ON "_pages_v_blocks_personnel_collection" USING btree ("_path");
  CREATE INDEX "authors_links_order_idx" ON "authors_links" USING btree ("_order");
  CREATE INDEX "authors_links_parent_id_idx" ON "authors_links" USING btree ("_parent_id");
  CREATE INDEX "authors_populated_authors_links_order_idx" ON "authors_populated_authors_links" USING btree ("_order");
  CREATE INDEX "authors_populated_authors_links_parent_id_idx" ON "authors_populated_authors_links" USING btree ("_parent_id");
  CREATE INDEX "_authors_v_version_links_order_idx" ON "_authors_v_version_links" USING btree ("_order");
  CREATE INDEX "_authors_v_version_links_parent_id_idx" ON "_authors_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_authors_v_version_populated_authors_links_order_idx" ON "_authors_v_version_populated_authors_links" USING btree ("_order");
  CREATE INDEX "_authors_v_version_populated_authors_links_parent_id_idx" ON "_authors_v_version_populated_authors_links" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_options_order_idx" ON "forms_blocks_radio_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_radio_options_parent_id_idx" ON "forms_blocks_radio_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_order_idx" ON "forms_blocks_radio" USING btree ("_order");
  CREATE INDEX "forms_blocks_radio_parent_id_idx" ON "forms_blocks_radio" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_path_idx" ON "forms_blocks_radio" USING btree ("_path");
  CREATE INDEX "navigation_header_links_order_idx" ON "navigation_header_links" USING btree ("_order");
  CREATE INDEX "navigation_header_links_parent_id_idx" ON "navigation_header_links" USING btree ("_parent_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_users_id_idx" ON "pages_rels" USING btree ("users_id");
  CREATE INDEX "_pages_v_rels_users_id_idx" ON "_pages_v_rels" USING btree ("users_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_personnel_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_personnel_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors_populated_authors_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v_version_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v_version_populated_authors_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_radio_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_radio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_header_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_header" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_personnel_collection" CASCADE;
  DROP TABLE "_pages_v_blocks_personnel_collection" CASCADE;
  DROP TABLE "authors_links" CASCADE;
  DROP TABLE "authors_populated_authors_links" CASCADE;
  DROP TABLE "_authors_v_version_links" CASCADE;
  DROP TABLE "_authors_v_version_populated_authors_links" CASCADE;
  DROP TABLE "forms_blocks_radio_options" CASCADE;
  DROP TABLE "forms_blocks_radio" CASCADE;
  DROP TABLE "navigation_header_links" CASCADE;
  DROP TABLE "navigation_header" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_users_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_users_fk";
  
  DROP INDEX "pages_rels_users_id_idx";
  DROP INDEX "_pages_v_rels_users_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "users_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "users_id";
  DROP TYPE "public"."enum_authors_links_icon";
  DROP TYPE "public"."enum__authors_v_version_links_icon";`)
}
