
ALTER TABLE "public"."todos" ADD COLUMN "owner_id" text;
ALTER TABLE "public"."todos" ALTER COLUMN "owner_id" DROP NOT NULL;

alter table "public"."todos" add foreign key ("owner_id") references "public"."users"("auth0_id") on update cascade on delete cascade;

ALTER TABLE "public"."todos" ALTER COLUMN "user_id" DROP NOT NULL;
