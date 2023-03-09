-- accounts
create table accounts (
  id uuid not null primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  token uuid unique not null default uuid_generate_v4(),
  created_ts TIMESTAMP WITH TIME ZONE not null default now(),
  updated_ts TIMESTAMP WITH TIME ZONE
);
alter table accounts enable row level security;
create policy "Can view own account." on accounts for select using (auth.uid() = user_id);

create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.accounts (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- decks

create table decks (
  id uuid not null primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  slug text unique not null default LOWER(
    SUBSTRING(
      MD5('' || NOW() :: TEXT || RANDOM() :: TEXT) FOR 8
    )
  ),
  created_ts TIMESTAMP WITH TIME ZONE not null default now(),
  updated_ts TIMESTAMP WITH TIME ZONE
);

alter table
  decks enable row level security;

create policy "Can create own decks." on decks for
insert
  with check (auth.uid() = user_id);

create policy "Can update own decks." on decks for
update
  using (auth.uid() = user_id);

create policy "Can view own decks." on decks for
select
  using (auth.uid() = user_id);

create or replace function public.tidy_deck_before_insert()
returns trigger as $$
begin
  new.created_ts := now();
  new.user_id = auth.uid();
  return new;
end;
$$ language plpgsql security definer;

create trigger on_deck_before_insert
  before insert on public.decks
  for each row execute procedure public.tidy_deck_before_insert();

create or replace function public.tidy_deck_before_update()
returns trigger as $$
begin
  new.slug = old.slug;
  new.updated_ts = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger on_deck_before_update
  before update on public.decks
  for each row execute procedure public.tidy_deck_before_update();

-- cards

create table cards (
  id uuid not null primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  deck_id uuid references public.decks not null,
  front text not null,
  back text not null,
  created_ts TIMESTAMP WITH TIME ZONE not null default now(),
  updated_ts TIMESTAMP WITH TIME ZONE
);

alter table
  cards enable row level security;

create policy "Can create own cards." on cards for
insert
  with check (auth.uid() = user_id);

create policy "Can update own cards." on cards for
update
  using (auth.uid() = user_id);

create policy "Can view own cards." on cards for
select
  using (auth.uid() = user_id);

create or replace function public.tidy_card_before_insert()
returns trigger as $$
begin
  new.created_ts := now();
  return new;
end;
$$ language plpgsql security definer;

create trigger on_card_before_insert
  before insert on public.cards
  for each row execute procedure public.tidy_card_before_insert();

create or replace function public.tidy_card_before_update()
returns trigger as $$
begin
  new.deck_id = old.deck_id;
  new.updated_ts = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger on_card_before_update
  before update on public.cards
  for each row execute procedure public.tidy_card_before_update();

-- plays

create table plays (
  id uuid not null primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  card_id uuid references public.cards not null,
  score integer,
  created_ts TIMESTAMP WITH TIME ZONE not null default now()
);

alter table
  plays enable row level security;

create policy "Can create own plays." on plays for
insert
  with check (auth.uid() = user_id);

create policy "Can view own plays." on plays for
select
  using (auth.uid() = user_id);

