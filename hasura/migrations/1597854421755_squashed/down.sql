
DROP TRIGGER IF EXISTS "set_public_users_updated_at" ON "public"."users";
ALTER TABLE "public"."users" DROP COLUMN "updated_at";

ALTER TABLE "public"."users" DROP COLUMN "created_at";

DROP TRIGGER IF EXISTS "set_public_todos_updated_at" ON "public"."todos";
ALTER TABLE "public"."todos" DROP COLUMN "updated_at";

ALTER TABLE "public"."todos" DROP COLUMN "created_at";
