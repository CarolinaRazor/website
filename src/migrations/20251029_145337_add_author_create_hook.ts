import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "authors_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer,
  	"job_title" varchar
  );
  
  CREATE TABLE "_authors_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar,
  	"avatar_id" integer,
  	"job_title" varchar
  );
  
  ALTER TABLE "authors_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v_version_hero_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "authors_hero_links" CASCADE;
  DROP TABLE "_authors_v_version_hero_links" CASCADE;
  ALTER TABLE "authors" DROP CONSTRAINT "authors_avatar_id_media_id_fk";
  
  ALTER TABLE "authors" DROP CONSTRAINT "authors_hero_media_id_media_id_fk";
  
  ALTER TABLE "_authors_v" DROP CONSTRAINT "_authors_v_version_avatar_id_media_id_fk";
  
  ALTER TABLE "_authors_v" DROP CONSTRAINT "_authors_v_version_hero_media_id_media_id_fk";
  
  DROP INDEX "authors_avatar_idx";
  DROP INDEX "authors_hero_hero_media_idx";
  DROP INDEX "_authors_v_version_version_avatar_idx";
  DROP INDEX "_authors_v_version_hero_version_hero_media_idx";
  ALTER TABLE "posts_populated_authors" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "posts_populated_authors" ADD COLUMN "job_title" varchar;
  ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN "job_title" varchar;
  ALTER TABLE "authors" ADD COLUMN "author_id" varchar;
  ALTER TABLE "_authors_v" ADD COLUMN "version_author_id" varchar;
  ALTER TABLE "users" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "users" ADD COLUMN "job_title" varchar;
  ALTER TABLE "authors_populated_authors" ADD CONSTRAINT "authors_populated_authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors_populated_authors" ADD CONSTRAINT "authors_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_authors_v_version_populated_authors" ADD CONSTRAINT "_authors_v_version_populated_authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v_version_populated_authors" ADD CONSTRAINT "_authors_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_authors_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "authors_populated_authors_order_idx" ON "authors_populated_authors" USING btree ("_order");
  CREATE INDEX "authors_populated_authors_parent_id_idx" ON "authors_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "authors_populated_authors_avatar_idx" ON "authors_populated_authors" USING btree ("avatar_id");
  CREATE INDEX "_authors_v_version_populated_authors_order_idx" ON "_authors_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_authors_v_version_populated_authors_parent_id_idx" ON "_authors_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_authors_v_version_populated_authors_avatar_idx" ON "_authors_v_version_populated_authors" USING btree ("avatar_id");
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_populated_authors_avatar_idx" ON "posts_populated_authors" USING btree ("avatar_id");
  CREATE INDEX "_posts_v_version_populated_authors_avatar_idx" ON "_posts_v_version_populated_authors" USING btree ("avatar_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  ALTER TABLE "authors" DROP COLUMN "avatar_id";
  ALTER TABLE "authors" DROP COLUMN "hero_type";
  ALTER TABLE "authors" DROP COLUMN "hero_rich_text";
  ALTER TABLE "authors" DROP COLUMN "hero_media_id";
  ALTER TABLE "authors" DROP COLUMN "bio";
  ALTER TABLE "_authors_v" DROP COLUMN "version_avatar_id";
  ALTER TABLE "_authors_v" DROP COLUMN "version_hero_type";
  ALTER TABLE "_authors_v" DROP COLUMN "version_hero_rich_text";
  ALTER TABLE "_authors_v" DROP COLUMN "version_hero_media_id";
  ALTER TABLE "_authors_v" DROP COLUMN "version_bio";
  DROP TYPE "public"."enum_authors_hero_links_link_type";
  DROP TYPE "public"."enum_authors_hero_links_link_appearance";
  DROP TYPE "public"."enum_authors_hero_type";
  DROP TYPE "public"."enum__authors_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__authors_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__authors_v_version_hero_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_authors_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_authors_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_authors_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__authors_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__authors_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__authors_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TABLE "authors_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_authors_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_authors_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "_authors_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__authors_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__authors_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  ALTER TABLE "authors_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v_version_populated_authors" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "authors_populated_authors" CASCADE;
  DROP TABLE "_authors_v_version_populated_authors" CASCADE;
  ALTER TABLE "posts_populated_authors" DROP CONSTRAINT "posts_populated_authors_avatar_id_media_id_fk";
  
  ALTER TABLE "_posts_v_version_populated_authors" DROP CONSTRAINT "_posts_v_version_populated_authors_avatar_id_media_id_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_media_id_fk";
  
  DROP INDEX "posts_populated_authors_avatar_idx";
  DROP INDEX "_posts_v_version_populated_authors_avatar_idx";
  DROP INDEX "users_avatar_idx";
  ALTER TABLE "authors" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "authors" ADD COLUMN "hero_type" "enum_authors_hero_type" DEFAULT 'lowImpact';
  ALTER TABLE "authors" ADD COLUMN "hero_rich_text" jsonb;
  ALTER TABLE "authors" ADD COLUMN "hero_media_id" integer;
  ALTER TABLE "authors" ADD COLUMN "bio" jsonb;
  ALTER TABLE "_authors_v" ADD COLUMN "version_avatar_id" integer;
  ALTER TABLE "_authors_v" ADD COLUMN "version_hero_type" "enum__authors_v_version_hero_type" DEFAULT 'lowImpact';
  ALTER TABLE "_authors_v" ADD COLUMN "version_hero_rich_text" jsonb;
  ALTER TABLE "_authors_v" ADD COLUMN "version_hero_media_id" integer;
  ALTER TABLE "_authors_v" ADD COLUMN "version_bio" jsonb;
  ALTER TABLE "authors_hero_links" ADD CONSTRAINT "authors_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_authors_v_version_hero_links" ADD CONSTRAINT "_authors_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_authors_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "authors_hero_links_order_idx" ON "authors_hero_links" USING btree ("_order");
  CREATE INDEX "authors_hero_links_parent_id_idx" ON "authors_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_authors_v_version_hero_links_order_idx" ON "_authors_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_authors_v_version_hero_links_parent_id_idx" ON "_authors_v_version_hero_links" USING btree ("_parent_id");
  ALTER TABLE "authors" ADD CONSTRAINT "authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "authors_avatar_idx" ON "authors" USING btree ("avatar_id");
  CREATE INDEX "authors_hero_hero_media_idx" ON "authors" USING btree ("hero_media_id");
  CREATE INDEX "_authors_v_version_version_avatar_idx" ON "_authors_v" USING btree ("version_avatar_id");
  CREATE INDEX "_authors_v_version_hero_version_hero_media_idx" ON "_authors_v" USING btree ("version_hero_media_id");
  ALTER TABLE "posts_populated_authors" DROP COLUMN "avatar_id";
  ALTER TABLE "posts_populated_authors" DROP COLUMN "job_title";
  ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN "avatar_id";
  ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN "job_title";
  ALTER TABLE "authors" DROP COLUMN "author_id";
  ALTER TABLE "_authors_v" DROP COLUMN "version_author_id";
  ALTER TABLE "users" DROP COLUMN "avatar_id";
  ALTER TABLE "users" DROP COLUMN "job_title";`)
}
