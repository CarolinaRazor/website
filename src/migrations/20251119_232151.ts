import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "subtitle" jsonb;
  ALTER TABLE "posts" ADD COLUMN "featuredtext" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_subtitle" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_featuredtext" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP COLUMN "subtitle";
  ALTER TABLE "posts" DROP COLUMN "featuredtext";
  ALTER TABLE "_posts_v" DROP COLUMN "version_subtitle";
  ALTER TABLE "_posts_v" DROP COLUMN "version_featuredtext";`)
}
