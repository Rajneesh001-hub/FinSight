# FinSight Backend API

Production-ready backend server for FinSight, a comprehensive personal finance management application with Supabase integration.

## Features

- **Express.js Server** with CORS enabled for frontend at `http://localhost:3001`
- **JWT Authentication** via Supabase tokens
- **Supabase Integration** for real-time data persistence
- **Complete API** for transactions, budgets, goals, and dashboard
- **CSV Import/Export** for bulk transaction management
- **Error Handling** with consistent response format
- **Request Logging** for debugging and monitoring

## Project Structure

```
src/
├── index.js                 # Main server file
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── routes/
│   ├── transactions.js     # Transaction endpoints
│   ├── dashboard.js        # Dashboard endpoints
│   ├── budgets.js          # Budget endpoints
│   ├── goals.js            # Goal endpoints
│   └── import.js           # Import/Export endpoints
├── controllers/
│   ├── transactionController.js
│   ├── dashboardController.js
│   ├── budgetController.js
│   ├── goalController.js
│   └── importController.js
└── utils/
    └── supabaseClient.js   # Supabase client initialization
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_URL=https://dztqoadafwtbjwadaivq.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
NODE_ENV=production
```

### 3. Database Schema

Ensure the following tables exist in Supabase:

**transactions**
```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL, -- 'income' or 'expense'
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

**budgets**
```sql
CREATE TABLE budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  limit_amount DECIMAL(10, 2) NOT NULL,
  period TEXT NOT NULL, -- 'monthly' or 'yearly'
  created_at TIMESTAMP DEFAULT now()
);
```

**goals**
```sql
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  deadline DATE NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

## Running the Server

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

Server runs on `http://localhost:5000` (or set `PORT` environment variable for a different port)

### Verify Server is Running
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-11-12T10:34:55.080Z"
}
```

## API Endpoints

### Health Check (No Auth Required)
- `GET /api/health` - Server health status

### Authentication
All endpoints (except health check) require JWT token in Authorization header:
```
Authorization: Bearer <supabase_jwt_token>
```

### Transactions
- `GET /api/transactions` - List transactions with optional filtering
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Dashboard
- `GET /api/dashboard` - Get overview stats (balance, income, expenses, trends, recent transactions)

### Budgets
- `GET /api/budgets` - List all budgets with current spending
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Goals
- `GET /api/goals` - List all goals with progress
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Import/Export
- `POST /api/import` - Import transactions from CSV file
- `GET /api/export` - Export transactions as CSV

## Request Examples

### Create Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "category": "groceries",
    "date": "2024-01-15",
    "type": "expense",
    "description": "Weekly shopping"
  }'
```

### Get Dashboard
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer <token>"
```

### Import Transactions
```bash
curl -X POST http://localhost:5000/api/import \
  -H "Authorization: Bearer <token>" \
  -F "file=@transactions.csv"
```

## Error Response Format

All error responses follow this consistent format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400,
  "details": "Additional details if available"
}
```

## Common Error Codes

- `MISSING_TOKEN` - No authorization token provided
- `INVALID_TOKEN` - Token is invalid or expired
- `VALIDATION_ERROR` - Request validation failed
- `NOT_FOUND` - Resource not found
- `DB_ERROR` - Database operation failed
- `SERVER_ERROR` - Internal server error

## Middleware

### CORS
Enabled for `http://localhost:3001` with credentials and specific methods.

### Request Logging
All requests are logged with timestamp, method, and path.

### Authentication
JWT tokens from Supabase are validated on all protected routes.

## Dependencies

- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing
- `@supabase/supabase-js` - Supabase client
- `dotenv` - Environment variable management
- `jsonwebtoken` - JWT token handling
- `multer` - File upload handling
- `fast-csv` - CSV parsing and generation
- `csv-parser` - CSV parsing utility
- `nodemon` - Development auto-reload (dev only)

## Development

For development with auto-reload:

```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

## Notes

- All timestamps are stored as ISO strings in Supabase
- User ID is extracted from JWT token's `sub` or `user_id` claim
- Pagination uses `limit` and `offset` query parameters
- Bulk import validates each row and provides detailed error reports
- Dashboard calculations are computed server-side for consistency
