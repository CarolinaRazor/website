import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "full_width" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_magazine" ADD COLUMN "full_width" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_verticalcategorystackblock" ADD COLUMN "full_width" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "full_width" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_magazine" ADD COLUMN "full_width" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_verticalcategorystackblock" ADD COLUMN "full_width" boolean DEFAULT true;
  ALTER TABLE "authors_blocks_archive" ADD COLUMN "full_width" boolean DEFAULT true;
  ALTER TABLE "_authors_v_blocks_archive" ADD COLUMN "full_width" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "full_width";
  ALTER TABLE "pages_blocks_magazine" DROP COLUMN "full_width";
  ALTER TABLE "pages_blocks_verticalcategorystackblock" DROP COLUMN "full_width";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "full_width";
  ALTER TABLE "_pages_v_blocks_magazine" DROP COLUMN "full_width";
  ALTER TABLE "_pages_v_blocks_verticalcategorystackblock" DROP COLUMN "full_width";
  ALTER TABLE "authors_blocks_archive" DROP COLUMN "full_width";
  ALTER TABLE "_authors_v_blocks_archive" DROP COLUMN "full_width";`)
}
