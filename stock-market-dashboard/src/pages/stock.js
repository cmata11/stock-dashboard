export function renderStockSearch() {
  document.getElementById('app').innerHTML = `
    <h1>Stock Search</h1>
    <div class="stock-search">
      <input id="ticker" placeholder="Enter ticker symbol (e.g., AAPL)" />
      <button id="searchBtn">Search</button>
    </div>
    <div id="stockResult"></div>
  `;

  document.getElementById('searchBtn').addEventListener('click', searchStock);
}

async function searchStock() {
  const ticker = document.getElementById('ticker').value.trim().toUpperCase();
  const output = document.getElementById('stockResult');
  output.innerHTML = "";

  if (!ticker) {
    output.innerHTML = `<p>Please enter a ticker symbol.</p>`;
    return;
  }

  const apiKey = "61851e5840f68d4a94391f1ee9d9a979";

  try {
    const [tickerRes, eodRes, divRes, splitRes] = await Promise.all([
      fetch(`https://api.marketstack.com/v1/tickers/${ticker}?access_key=${apiKey}`),
      fetch(`https://api.marketstack.com/v1/eod?access_key=${apiKey}&symbols=${ticker}&limit=1`),
      fetch(`https://api.marketstack.com/v1/dividends?access_key=${apiKey}&symbols=${ticker}&limit=1`),
      fetch(`https://api.marketstack.com/v1/splits?access_key=${apiKey}&symbols=${ticker}&limit=1`)
    ]);

    const info = await tickerRes.json();
    const eodData = await eodRes.json();
    const divData = (await divRes.json()).data?.[0];
    const splitData = (await splitRes.json()).data?.[0];

    if (!info || info.error) {
      output.innerHTML = `<p>❌ Ticker not found. Please check the symbol and try again.</p>`;
      return;
    }

    const latest = eodData.data?.[0];

    output.innerHTML = `
      <h2>${info.name} (${info.symbol})</h2>
      <p><strong>Exchange:</strong> ${info.stock_exchange.name}</p>
      <p><strong>City:</strong> ${info.stock_exchange.city}</p>
      ${latest ? `<p><strong>Latest Close:</strong> $${latest.close} on ${latest.date.split('T')[0]}</p>` : ""}
      ${divData ? `<p><strong>Dividend:</strong> $${divData.dividend} on ${divData.date}</p>` : ""}
      ${splitData ? `<p><strong>Last Split:</strong> ${splitData.split_ratio} on ${splitData.date}</p>` : ""}
      <button id="saveFavorite">⭐ Save to Favorites</button>
    `;

    document.getElementById('saveFavorite').addEventListener('click', async () => {
      const favoritesRes = await fetch('http://localhost:3001/api/favorites');
      const favorites = await favoritesRes.json();

      if (favorites.some(fav => fav.symbol === info.symbol)) {
        alert("⚠️ This ticker is already saved.");
        return;
      }

      const res = await fetch('http://localhost:3001/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: info.symbol, name: info.name })
      });

      const result = await res.json();
      alert(result.status || "Saved!");
    });

  } catch (err) {
    output.innerHTML = `<p>❌ Error loading stock data.</p>`;
    console.error(err);
  }
}
