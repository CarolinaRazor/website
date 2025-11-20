import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "authors_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_authors_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "authors_blocks_rich_text" ADD CONSTRAINT "authors_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_authors_v_blocks_rich_text" ADD CONSTRAINT "_authors_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_authors_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "authors_blocks_rich_text_order_idx" ON "authors_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "authors_blocks_rich_text_parent_id_idx" ON "authors_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "authors_blocks_rich_text_path_idx" ON "authors_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_authors_v_blocks_rich_text_order_idx" ON "_authors_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_authors_v_blocks_rich_text_parent_id_idx" ON "_authors_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_authors_v_blocks_rich_text_path_idx" ON "_authors_v_blocks_rich_text" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "authors_blocks_rich_text" CASCADE;
  DROP TABLE "_authors_v_blocks_rich_text" CASCADE;`)
}
