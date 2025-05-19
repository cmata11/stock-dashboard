import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Supabase client setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET /api/favorites - Get all saved tickers
app.get('/api/favorites', async (req, res) => {
  const { data, error } = await supabase.from('favorites').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/favorites - Save a new ticker
app.post('/api/favorites', async (req, res) => {
  const { symbol, name } = req.body;

  if (!symbol || !name) {
    return res.status(400).json({ error: 'Missing symbol or name' });
  }

  // Optional: Prevent duplicate save at backend level
  const { data: existing } = await supabase
    .from('favorites')
    .select('*')
    .eq('symbol', symbol);

  if (existing && existing.length > 0) {
    return res.status(409).json({ error: 'Ticker already saved' });
  }

  const { data, error } = await supabase
    .from('favorites')
    .insert([{ symbol, name }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ status: 'Saved!', entry: data });
});

// DELETE /api/favorites/:symbol - Delete a ticker
app.delete('/api/favorites/:symbol', async (req, res) => {
  const { symbol } = req.params;

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('symbol', symbol);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ status: 'Deleted' });
});

// ✅ Server start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
