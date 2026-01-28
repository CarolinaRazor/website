import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_publishedat_tz" AS ENUM('America/New_York');
  CREATE TYPE "public"."enum__pages_v_version_publishedat_tz" AS ENUM('America/New_York');
  CREATE TYPE "public"."enum_posts_publishedat_tz" AS ENUM('America/New_York');
  CREATE TYPE "public"."enum__posts_v_version_publishedat_tz" AS ENUM('America/New_York');
  CREATE TYPE "public"."enum_authors_publishedat_tz" AS ENUM('America/New_York');
  CREATE TYPE "public"."enum__authors_v_version_publishedat_tz" AS ENUM('America/New_York');
  ALTER TABLE "pages" ADD COLUMN "publishedat_tz" "enum_pages_publishedat_tz" DEFAULT 'America/New_York';
  ALTER TABLE "_pages_v" ADD COLUMN "version_publishedat_tz" "enum__pages_v_version_publishedat_tz" DEFAULT 'America/New_York';
  ALTER TABLE "posts" ADD COLUMN "publishedat_tz" "enum_posts_publishedat_tz" DEFAULT 'America/New_York';
  ALTER TABLE "_posts_v" ADD COLUMN "version_publishedat_tz" "enum__posts_v_version_publishedat_tz" DEFAULT 'America/New_York';
  ALTER TABLE "authors" ADD COLUMN "publishedat_tz" "enum_authors_publishedat_tz" DEFAULT 'America/New_York';
  ALTER TABLE "_authors_v" ADD COLUMN "version_publishedat_tz" "enum__authors_v_version_publishedat_tz" DEFAULT 'America/New_York';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "publishedat_tz";
  ALTER TABLE "_pages_v" DROP COLUMN "version_publishedat_tz";
  ALTER TABLE "posts" DROP COLUMN "publishedat_tz";
  ALTER TABLE "_posts_v" DROP COLUMN "version_publishedat_tz";
  ALTER TABLE "authors" DROP COLUMN "publishedat_tz";
  ALTER TABLE "_authors_v" DROP COLUMN "version_publishedat_tz";
  DROP TYPE "public"."enum_pages_publishedat_tz";
  DROP TYPE "public"."enum__pages_v_version_publishedat_tz";
  DROP TYPE "public"."enum_posts_publishedat_tz";
  DROP TYPE "public"."enum__posts_v_version_publishedat_tz";
  DROP TYPE "public"."enum_authors_publishedat_tz";
  DROP TYPE "public"."enum__authors_v_version_publishedat_tz";`)
}
