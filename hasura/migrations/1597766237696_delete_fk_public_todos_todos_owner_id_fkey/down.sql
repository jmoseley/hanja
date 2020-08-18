alter table "public"."todos" add foreign key ("owner_id") references "public"."users"("id") on update cascade on delete cascade;
