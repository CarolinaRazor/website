import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts_populated_authors" DROP CONSTRAINT "posts_populated_authors_avatar_id_media_id_fk";
  
  ALTER TABLE "_posts_v_version_populated_authors" DROP CONSTRAINT "_posts_v_version_populated_authors_avatar_id_media_id_fk";
  
  ALTER TABLE "authors_populated_authors" DROP CONSTRAINT "authors_populated_authors_avatar_id_media_id_fk";
  
  ALTER TABLE "authors" DROP CONSTRAINT "authors_user_id_users_id_fk";
  
  ALTER TABLE "_authors_v_version_populated_authors" DROP CONSTRAINT "_authors_v_version_populated_authors_avatar_id_media_id_fk";
  
  ALTER TABLE "_authors_v" DROP CONSTRAINT "_authors_v_version_user_id_users_id_fk";
  
  DROP INDEX "authors_user_idx";
  DROP INDEX "_authors_v_version_version_user_idx";
  ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "posts_populated_authors" ADD COLUMN "author_page" numeric;
  ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN "author_page" numeric;
  ALTER TABLE "users" ADD COLUMN "page" numeric;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_avatar_id_avatars_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_avatar_id_avatars_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors_populated_authors" ADD CONSTRAINT "authors_populated_authors_avatar_id_avatars_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v_version_populated_authors" ADD CONSTRAINT "_authors_v_version_populated_authors_avatar_id_avatars_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" DROP COLUMN "user_id";
  ALTER TABLE "_authors_v" DROP COLUMN "version_user_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts_populated_authors" DROP CONSTRAINT "posts_populated_authors_avatar_id_avatars_id_fk";
  
  ALTER TABLE "_posts_v_version_populated_authors" DROP CONSTRAINT "_posts_v_version_populated_authors_avatar_id_avatars_id_fk";
  
  ALTER TABLE "authors_populated_authors" DROP CONSTRAINT "authors_populated_authors_avatar_id_avatars_id_fk";
  
  ALTER TABLE "_authors_v_version_populated_authors" DROP CONSTRAINT "_authors_v_version_populated_authors_avatar_id_avatars_id_fk";
  
  ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "authors" ADD COLUMN "user_id" integer;
  ALTER TABLE "_authors_v" ADD COLUMN "version_user_id" integer;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors_populated_authors" ADD CONSTRAINT "authors_populated_authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v_version_populated_authors" ADD CONSTRAINT "_authors_v_version_populated_authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_version_user_id_users_id_fk" FOREIGN KEY ("version_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "authors_user_idx" ON "authors" USING btree ("user_id");
  CREATE INDEX "_authors_v_version_version_user_idx" ON "_authors_v" USING btree ("version_user_id");
  ALTER TABLE "posts_populated_authors" DROP COLUMN "author_page";
  ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN "author_page";
  ALTER TABLE "users" DROP COLUMN "page";`)
}
