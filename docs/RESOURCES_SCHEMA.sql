-- Create resources table in Supabase
create table resources (
  id text primary key,
  title text not null,
  purpose text,
  format text,
  grade_band text,
  skill text,
  is_free boolean default true,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  -- Indexes for fast queries
  constraint resources_title_key unique(title)
);

create index resources_skill_idx on resources(skill);
create index resources_grade_band_idx on resources(grade_band);
create index resources_is_free_idx on resources(is_free);
create index resources_updated_at_idx on resources(updated_at desc);

-- Enable RLS
alter table resources enable row level security;

-- Allow anyone to read resources
create policy "resources_are_public"
  on resources for select
  using (true);

-- Enable change tracking
create table resource_syncs (
  id uuid primary key default uuid_generate_v4(),
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  resource_count integer,
  error text,
  status text check (status in ('pending', 'success', 'error'))
);

create index resource_syncs_completed_at_idx on resource_syncs(completed_at desc);
