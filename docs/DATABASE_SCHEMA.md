# Database Schema

## Supabase Tables

### subscriptions

This table tracks user subscription information.

```sql
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique,
  tier text not null default 'free' check (tier in ('free', 'pro', 'school')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  current_period_end timestamp with time zone,
  
  constraint subscriptions_user_id_fkey 
    foreign key (user_id) 
    references auth.users(id) 
    on delete cascade
);

create index subscriptions_user_id_idx on subscriptions(user_id);
```

### Tier Types

- **free**: Free tier users with access to 500 resources
- **pro**: Individual professional subscription with full resource access
- **school**: School/district subscription tier

### Status Types

- **active**: Subscription is currently active and valid
- **cancelled**: User cancelled their subscription
- **expired**: Subscription period has expired

## Setup Instructions

1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Run the SQL commands above to create the `subscriptions` table
4. The table will automatically sync with the RLS (Row Level Security) policies for auth

## Key Relationships

- `user_id` foreign key references the `auth.users` table
- On user deletion, their subscription record is automatically deleted (cascade)
