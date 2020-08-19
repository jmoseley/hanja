
alter table "public"."todos" drop constraint "todos_owner_id_fkey";

ALTER TABLE "public"."todos" ALTER COLUMN "owner_id" TYPE uuid;

alter table "public"."todos" add foreign key ("owner_id") references "public"."users"("id") on update cascade on delete cascade;

alter table "public"."users" drop constraint "users_auth0_id_key";

alter table "public"."todos" drop constraint "todos_owner_id_fkey";

DROP TABLE "public"."users";

ALTER TABLE "public"."todos" DROP COLUMN "owner_id";

DROP TABLE "public"."todos";
