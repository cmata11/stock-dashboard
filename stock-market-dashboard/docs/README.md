# 🛠️ Developer Manual

This document explains how to set up and work with the Stock Market Dashboard project.

---

## 📦 Installation Instructions

### Prerequisites:

* [Node.js](https://nodejs.org/) installed
* A [Supabase](https://supabase.com/) account with a project and table set up

### Setup Steps:

1. Clone the GitHub repository:

   ```bash
   git clone https://github.com/your-username/stock-market-dashboard.git
   cd stock-market-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-key
   ```

4. Start the frontend:

   ```bash
   npm run dev
   ```

5. Start the backend (in another terminal):

   ```bash
   node supabase/backend.js
   ```

Frontend runs at: `http://localhost:5173`
Backend runs at: `http://localhost:3001`

---

## 🧪 Running Tests

No automated tests are currently implemented. Consider using Jest or Vitest for future development.

---

## 📡 API Endpoints (Backend)

### `GET /api/favorites`

* Returns all saved favorite stocks from Supabase

### `POST /api/favorites`

* Adds a new favorite stock
* Body format:

  ```json
  {
    "symbol": "AAPL",
    "name": "Apple Inc."
  }
  ```

### `DELETE /api/favorites/:symbol`

* Deletes a favorite stock by symbol

---

## 🐛 Known Issues

* Supabase doesn’t enforce unique symbols; frontend avoids duplicates
* No authentication — data is public
* Basic styling, minimal mobile optimization

---

## 🛣️ Future Roadmap

* Add user authentication (Supabase Auth)
* Display stock news or financial stats
* Implement unit tests and integration testing
* Allow sorting or filtering of favorites
* Add toast notifications for UX feedback

---

## 📁 File Structure

```
stock-market-dashboard/
├── index.html
├── vite.config.js
├── package.json
├── .env (not committed)
├── /src
│   ├── main.js
│   └── pages/
│       ├── home.js
│       ├── about.js
│       ├── stock.js
│       └── favorites.js
├── /supabase
│   └── backend.js
├── /docs
│   └── README.md
```

---

## 🧠 For New Developers

* Always run frontend and backend together
* Backend needs `.env` to function
* Make sure your Supabase table `favorites` has at least:

  * `symbol` (text)
  * `name` (text)

You’re welcome to add new features, improve styling, or transition the project to React!
