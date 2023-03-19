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

alter table decks add column num_plays bigint default 0;
alter table decks add column play_score_sum bigint default 0;

create or replace function public.update_deck_score(deck_id uuid, score smallint)
returns void as $$
begin
  update decks
  set
    num_plays = num_plays + 1,
    play_score_sum = play_score_sum + score
  where
    user_id = auth.uid()
    and id = deck_id;
end;
$$ language plpgsql security definer;

alter table
  decks enable row level security;

alter table decks add column token uuid unique not null default uuid_generate_v4();

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

alter table
  cards add column learn boolean not null default true;

alter table
  cards add column box smallint not null default 1;

alter table
  cards add column last_played_ts TIMESTAMP WITH TIME ZONE;

alter table
  cards add column next_play_ts TIMESTAMP WITH TIME ZONE default now();

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

--
create or replace function cards_to_play(param_user_id uuid)
returns TABLE (
        r_deck_id uuid,
        r_when_to_play text,
        r_count bigint
) 
AS $$
begin
  RETURN QUERY select 
    deck_id, when_to_play, count(*)
  from
    (
      select
        decks.id as deck_id,
        case
          when cards.next_play_ts <= now() then 'today'
          when cards.next_play_ts <= now() + interval '1 day' then 'tomorrow'
        end as when_to_play
      from
        decks inner join cards on decks.id = cards.deck_id
      where decks.user_id = param_user_id
        and cards.learn = true
    ) sub
  group by deck_id, when_to_play;
end;
$$ LANGUAGE 'plpgsql';

--
create or replace function total_cards(param_user_id uuid)
returns TABLE (
        r_deck_id uuid,
        r_count bigint
) 
AS $$
begin
  RETURN QUERY select 
    deck_id, count(*)
  from
    (
      select
        decks.id as deck_id
      from
        decks inner join cards on decks.id = cards.deck_id
      where decks.user_id = param_user_id
    ) sub
  group by deck_id;
end;
$$ LANGUAGE 'plpgsql';