# FinSight Backend - Quick Start Guide

## 1. Prerequisites

- Node.js 14+ installed
- Supabase account with project created
- Database tables created (see Database Setup below)

## 2. Installation

```bash
cd /Users/rajneesharya/Desktop/FinSight-Backend
npm install
```

## 3. Environment Setup

Create/verify `.env` file with:
```env
SUPABASE_URL=https://dztqoadafwtbjwadaivq.supabase.co
SUPABASE_ANON_KEY=sb_publishable_j7Qt6tD4-gdn20ts4ztpHQ_uyplHIpa
PORT=5000
NODE_ENV=production
```

## 4. Database Setup

Run these SQL queries in Supabase SQL Editor:

```sql
-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Create budgets table
CREATE TABLE budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  limit_amount DECIMAL(10, 2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('monthly', 'yearly')),
  created_at TIMESTAMP DEFAULT now()
);

-- Create goals table
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  deadline DATE NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS (Row Level Security) for each table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
```

## 5. Start the Server

### Development (with hot reload):
```bash
npm run dev
```

### Production:
```bash
npm start
```

Server runs on **http://localhost:5000**

## 6. Test the API

### Health Check (no auth needed)
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Get Dashboard (requires auth token)
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN"
```

### Create a Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "category": "groceries",
    "date": "2024-01-15",
    "type": "expense",
    "description": "Weekly shopping"
  }'
```

## 7. API Endpoints

### Transactions
- `GET /api/transactions` - List all
- `POST /api/transactions` - Create
- `PUT /api/transactions/:id` - Update
- `DELETE /api/transactions/:id` - Delete

### Dashboard
- `GET /api/dashboard` - Get overview stats

### Budgets
- `GET /api/budgets` - List all
- `POST /api/budgets` - Create
- `PUT /api/budgets/:id` - Update
- `DELETE /api/budgets/:id` - Delete

### Goals
- `GET /api/goals` - List all
- `POST /api/goals` - Create
- `PUT /api/goals/:id` - Update
- `DELETE /api/goals/:id` - Delete

### Import/Export
- `POST /api/import` - Import CSV
- `GET /api/export` - Export to CSV

## 8. Getting Your Auth Token

1. Sign up or log in to your FinSight frontend (http://localhost:3001)
2. Open browser DevTools → Application → Cookies
3. Find the Supabase session token, or
4. Use Supabase auth directly:

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123"
});

const token = data.session.access_token;
```

## 9. Debugging

Check server logs for request details:
```
[2024-01-15T10:30:00.000Z] GET /api/transactions
[2024-01-15T10:30:00.123Z] POST /api/transactions
```

## 10. Common Issues

### Port already in use
Change PORT in .env and restart server

### No transactions showing
Ensure JWT token is valid and user_id matches

### 401 Unauthorized
Check Authorization header format: `Bearer <token>`

### CORS errors
Verify frontend URL is `http://localhost:3001`

## 11. Production Deployment

See README.md for deployment instructions to production servers.

---

**For full documentation:** See `README.md` and `IMPLEMENTATION_SUMMARY.md`
