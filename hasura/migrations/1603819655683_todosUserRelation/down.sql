
alter table "public"."todos" drop constraint "todos_user_id_fkey";

select 1;
ALTER TABLE "public"."todos" DROP COLUMN "user_id";
