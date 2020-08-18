CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."todos"("name" text NOT NULL, "id" uuid NOT NULL DEFAULT gen_random_uuid(), "completed" boolean NOT NULL DEFAULT False, PRIMARY KEY ("id") );
