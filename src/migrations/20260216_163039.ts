import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "search_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"author_i_d" varchar,
  	"name" varchar
  );
  
  ALTER TABLE "search" ADD COLUMN "published_at" timestamp(3) with time zone;
  ALTER TABLE "search_authors" ADD CONSTRAINT "search_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "search_authors_order_idx" ON "search_authors" USING btree ("_order");
  CREATE INDEX "search_authors_parent_id_idx" ON "search_authors" USING btree ("_parent_id");
  CREATE INDEX "search_published_at_idx" ON "search" USING btree ("published_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "search_authors" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "search_authors" CASCADE;
  DROP INDEX "search_published_at_idx";
  ALTER TABLE "search" DROP COLUMN "published_at";`)
}
