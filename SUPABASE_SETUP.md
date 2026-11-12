# FinSight + Supabase Authentication Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"** (Sign up if needed)
3. Fill in:
   - **Project name:** FinSight
   - **Database password:** (save this securely!)
   - **Region:** Choose closest to India (Singapore recommended)
4. Wait 2-3 minutes for project to be ready
5. You'll land on the dashboard

---

## Step 2: Get Your Credentials

1. Go to **Project Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** (looks like: `https://abc123xyz.supabase.co`)
   - **Anon Key** (long string starting with `eyJ...`)

---

## Step 3: Fill Environment Variables

1. Open `.env.local` in your project root
2. Paste your credentials:

```
VITE_SUPABASE_URL=https://your_project_url_here.supabase.co
VITE_SUPABASE_ANON_KEY=your_long_anon_key_here
```

**Example:**
```
VITE_SUPABASE_URL=https://abc123xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy and paste this entire SQL script:

```sql
-- Profiles table (stores user info)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table (stores all transactions)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'income' or 'expense'
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  category TEXT NOT NULL,
  limit DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (users can only see/edit their own data)

-- Profiles: users see only their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Transactions: users see only their own transactions
CREATE POLICY "Users can view own transactions" 
  ON transactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
  ON transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" 
  ON transactions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" 
  ON transactions FOR DELETE 
  USING (auth.uid() = user_id);

-- Budgets: users see only their own budgets
CREATE POLICY "Users can view own budgets" 
  ON budgets FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets" 
  ON budgets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets" 
  ON budgets FOR UPDATE 
  USING (auth.uid() = user_id);

-- Goals: users see only their own goals
CREATE POLICY "Users can view own goals" 
  ON goals FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" 
  ON goals FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" 
  ON goals FOR UPDATE 
  USING (auth.uid() = user_id);
```

4. Click **"Run"** (▶ button)
5. Wait for success message ✅

---

## Step 5: Enable Email Auth

1. Go to **Authentication** → **Providers** (left sidebar)
2. Make sure **Email** is enabled (it should be by default)
3. You're all set!

---

## Step 6: Test the App

1. Stop dev server if running: `CTRL+C`
2. Restart: `npm run dev`
3. Try to sign up:
   - Go to http://localhost:3001/register
   - Fill in the form with test data
   - Click "Create Account"
4. If successful, you'll see the dashboard!

---

## Step 7: Verify Your Data

1. In Supabase dashboard, go to **Table Editor**
2. You should see:
   - `auth.users` table — contains your account
   - `profiles` table — your profile info
3. Click on each to verify data was saved

---

## What's Connected Now?

✅ **Registration** — Creates user account + profile in Supabase
✅ **Login** — Authenticates against Supabase Auth
✅ **Session Management** — Frontend stores JWT token
✅ **Row Level Security** — Users can only see their own data
✅ **Database** — Tables ready for transactions, budgets, goals

---

## Next Steps

Once auth is working, we need to:

1. **Connect Dashboard to real data** — Replace mock data with Supabase queries
2. **Add transactions API** — Fetch/create/update transactions from Supabase
3. **Add budgets API** — Same for budgets
4. **Add goals API** — Same for goals
5. **Connect settings** — Save user preferences to Supabase

---

## Troubleshooting

### "Missing Supabase credentials"
- Check `.env.local` has correct URL and ANON_KEY
- Restart dev server after updating `.env.local`

### "Auth error: User already registered"
- That email is already in Supabase. Use a different email or delete the user:
  - Go to Supabase dashboard → **Authentication** → **Users**
  - Find the user → click the trash icon to delete
  - Try signing up again

### "Table 'profiles' does not exist"
- Run the SQL script from Step 4 again
- Make sure you clicked "Run" and saw success ✅

### Supabase dashboard not loading
- Hard refresh: `CMD+SHIFT+R` (macOS) or `CTRL+SHIFT+R` (Windows/Linux)
- Check your internet connection

---

## Questions?

All the code is connected. Just follow these steps and you're ready to build real features!
