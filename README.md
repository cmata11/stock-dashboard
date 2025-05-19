
# 🛠️ Developer Manual 

Welcome to the Stock Market Dashboard! This guide will help you set it up and run it smoothly.

---

## How to Get Started

### 1. Clone the Project
```bash
git clone https://github.com/cmata11/stock-dashboard/blob/main/stock-market-dashboard/index.html
cd stock-market-dashboard/stock-market-dashboard
```

### 2. Install Everything
```bash
npm install
```

### 3. Create Your `.env` File
In the root of your Vite project folder (`stock-market-dashboard/`), create a file named `.env` and add:

```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

---

## Running the App

### Frontend (Vite)
```bash
npm run dev
```
Visit: `http://localhost:5173`

### Backend (Supabase + Express)
```bash
node supabase/backend.js
```
Runs on: `http://localhost:3001`

---

## API Endpoints

### `GET /api/favorites`
- Returns saved favorites

### `POST /api/favorites`
- Adds a favorite (needs `symbol` and `name`)

### `DELETE /api/favorites/:symbol`
- Deletes a favorite by symbol

---

## Notes
- Make sure Node.js is installed
- Charts use Marketstack API — rate limits may apply
- If using Vercel: Set root directory to `stock-market-dashboard`

---

You're ready to go! 
