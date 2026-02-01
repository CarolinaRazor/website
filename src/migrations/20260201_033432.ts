import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "subscribers" RENAME COLUMN "confirmed" TO "subscribed";
  ALTER TABLE "subscribers" ADD COLUMN "resend_id" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "subscribers" RENAME COLUMN "subscribed" TO "confirmed";
  ALTER TABLE "subscribers" DROP COLUMN "resend_id";`)
}
