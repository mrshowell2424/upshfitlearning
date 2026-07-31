# Authentication & Subscription Setup Guide

## Overview

This project uses Supabase for authentication and subscription tracking. The system includes:

- User authentication (sign-up, sign-in, sign-out)
- Subscription tier management (free, pro, school)
- Resource access control based on subscription tier
- Premium feature routing

## Files Created

### Auth Provider & Context
- **app/providers/AuthProvider.tsx** - React context for managing auth state across the app
- **lib/auth.ts** - Supabase client and authentication utilities
- **lib/hooks/useSubscription.ts** - Custom hook for accessing subscription data

### API Endpoints
- **app/api/auth/signin/route.ts** - POST endpoint for user sign-in
- **app/api/auth/signup/route.ts** - POST endpoint for user sign-up
- **app/api/auth/signout/route.ts** - POST endpoint for user sign-out
- **app/api/auth/subscription/route.ts** - GET/POST endpoints for subscription management

### Configuration
- **docs/DATABASE_SCHEMA.md** - SQL schema for the subscriptions table
- **app/layout.tsx** - Root layout wrapped with AuthProvider

## Supabase Setup

### 1. Create the subscriptions table

In your Supabase dashboard:

1. Go to SQL Editor
2. Create a new query
3. Paste and run the following SQL:

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

### 2. Set up RLS (Row Level Security) policies

Enable RLS on the subscriptions table:

1. Go to Authentication → Policies
2. Click "Enable RLS" on the subscriptions table
3. Add the following policies:

**Policy: Users can read their own subscription**
```sql
auth.uid() = user_id
```
(SELECT only)

**Policy: System can create subscriptions**
```sql
true
```
(For INSERT via service role)

## Usage in Components

### Using the useAuth hook

```tsx
'use client'

import { useAuth } from '@/app/providers/AuthProvider'

export default function MyComponent() {
  const { user, subscription, isPremium, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please log in</div>
  }

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <p>Your plan: {subscription?.tier}</p>
      {isPremium && <p>You have premium access!</p>}
    </div>
  )
}
```

### Using the useSubscription hook

```tsx
'use client'

import { useSubscription } from '@/lib/hooks/useSubscription'

export default function MyComponent() {
  const {
    user,
    isPremium,
    canAccessPremiumFeatures,
    currentLimit,
    signOut,
  } = useSubscription()

  return (
    <div>
      <p>Resources available: {currentLimit || 'Unlimited'}</p>
      {canAccessPremiumFeatures && (
        <button>Generate Lessons</button>
      )}
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## API Endpoint Usage

### Sign Up

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password",
    "fullName": "John Doe"
  }'
```

### Sign In

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password"
  }'
```

### Get Subscription

```bash
curl -X GET http://localhost:3000/api/auth/subscription \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### Update Subscription

```bash
curl -X POST http://localhost:3000/api/auth/subscription \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "tier": "pro",
    "status": "active"
  }'
```

### Sign Out

```bash
curl -X POST http://localhost:3000/api/auth/signout
```

## Subscription Tiers

### Free Tier
- Access to 500 curated resources
- Read-only access to resource library
- Teacher's Lounge articles
- No lesson generation

### Pro Tier
- Access to all 2,688+ resources
- Generate lesson materials in 4 formats (slides, docs, worksheets, assessments)
- Save resources to planner
- Full resource library filtering

### School Tier
- All Pro features
- Team collaboration and sharing
- Admin dashboard for school managers
- Bulk resource management

## Home Page Routing

The home page now uses the auth context to route users:

- **Unauthenticated users**: See the full marketing experience
- **Free tier users**: "Match my standard" button routes to `/match?q=...`
- **Premium tier users**: "Match my standard" button routes to `/resources?search=...`

## Environment Variables

Ensure these are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Next Steps

1. Create the subscriptions table in Supabase
2. Create a sign-up/sign-in page (or use Supabase Auth UI)
3. Add the AuthProvider to your root layout (already done)
4. Test the auth flow in the browser
5. Integrate Stripe for premium subscriptions (optional)

## Troubleshooting

### "useAuth must be used within AuthProvider" error
- Make sure the component is marked with `'use client'`
- Verify the component is wrapped by the AuthProvider in the component tree

### Subscriptions table not found
- Run the SQL schema creation script in Supabase SQL Editor
- Verify the table appears in the database
- Check the table has RLS policies enabled

### Auth state not persisting
- Supabase session should persist automatically via its session storage
- Check browser DevTools → Application → Cookies for supabase-auth-token

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
