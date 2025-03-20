-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  sponsor_id uuid references public.profiles(id),
  binary_parent_id uuid references public.profiles(id),
  binary_position text check (binary_position in ('left', 'right')),
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id),
  unique(email)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = user_id );

-- Create indexes
create index profiles_user_id_idx on public.profiles(user_id);
create index profiles_email_idx on public.profiles(email);
create index profiles_sponsor_id_idx on public.profiles(sponsor_id);
create index profiles_binary_parent_id_idx on public.profiles(binary_parent_id);

-- Set up Row Level Security
create policy "Profiles are viewable by users who created them." on profiles
  for select using (
    auth.uid() = user_id
  );

-- Create function to handle user creation with sponsor assignment
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_sponsor_id uuid;
  v_binary_parent_id uuid;
  v_binary_position text;
begin
  -- Get sponsor_id from metadata if provided
  v_sponsor_id := (new.raw_user_meta_data->>'sponsor_id')::uuid;
  
  -- If no sponsor provided, assign to default admin sponsor (you'll need to set this up)
  if v_sponsor_id is null then
    -- You should replace this with your default admin/root user ID
    v_sponsor_id := (select id from public.profiles where user_id = 'YOUR_ADMIN_USER_ID' limit 1);
  end if;
  
  -- Find binary placement
  with recursive binary_tree as (
    select id, binary_parent_id, binary_position, 0 as level
    from public.profiles
    where sponsor_id = v_sponsor_id
    union all
    select p.id, p.binary_parent_id, p.binary_position, bt.level + 1
    from public.profiles p
    inner join binary_tree bt on p.binary_parent_id = bt.id
  )
  select id into v_binary_parent_id
  from binary_tree
  where (
    select count(*) 
    from public.profiles 
    where binary_parent_id = binary_tree.id
  ) < 2
  order by level, id
  limit 1;

  -- Determine binary position
  v_binary_position := case when (
    select count(*) 
    from public.profiles 
    where binary_parent_id = v_binary_parent_id
  ) = 0 then 'left' else 'right' end;

  -- Insert profile with sponsor and binary placement
  insert into public.profiles (
    user_id,
    sponsor_id,
    binary_parent_id,
    binary_position,
    full_name,
    email
  )
  values (
    new.id,
    v_sponsor_id,
    v_binary_parent_id,
    v_binary_position,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 