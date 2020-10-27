
ALTER TABLE "public"."todos" ALTER COLUMN "user_id" SET NOT NULL;

alter table "public"."todos" drop constraint "todos_owner_id_fkey";

ALTER TABLE "public"."todos" DROP COLUMN "owner_id" CASCADE;
