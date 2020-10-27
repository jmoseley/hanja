
ALTER TABLE "public"."todos" ADD COLUMN "user_id" uuid NULL;

UPDATE todos
SET user_id = users.id
FROM
users where users.auth0_id = todos.owner_id;

alter table "public"."todos"
           add constraint "todos_user_id_fkey"
           foreign key ("user_id")
           references "public"."users"
           ("id") on update cascade on delete cascade;
