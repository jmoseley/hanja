
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."todos"("name" text NOT NULL, "id" uuid NOT NULL DEFAULT gen_random_uuid(), "completed" boolean NOT NULL DEFAULT False, PRIMARY KEY ("id") );

ALTER TABLE "public"."todos" ADD COLUMN "owner_id" uuid NOT NULL;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."users"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "auth0_id" text NOT NULL, PRIMARY KEY ("id") );

alter table "public"."todos"
           add constraint "todos_owner_id_fkey"
           foreign key ("owner_id")
           references "public"."users"
           ("id") on update cascade on delete cascade;

alter table "public"."users" add constraint "users_auth0_id_key" unique ("auth0_id");

alter table "public"."todos" drop constraint "todos_owner_id_fkey";

ALTER TABLE "public"."todos" ALTER COLUMN "owner_id" TYPE text;

alter table "public"."todos"
           add constraint "todos_owner_id_fkey"
           foreign key ("owner_id")
           references "public"."users"
           ("auth0_id") on update cascade on delete cascade;
