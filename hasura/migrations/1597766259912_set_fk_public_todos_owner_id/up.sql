alter table "public"."todos"
           add constraint "todos_owner_id_fkey"
           foreign key ("owner_id")
           references "public"."users"
           ("auth0_id") on update cascade on delete cascade;
