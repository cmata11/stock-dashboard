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
    const [tickerRes, eodRes] = await Promise.all([
      fetch(`https://api.marketstack.com/v1/tickers/${ticker}?access_key=${apiKey}`),
      fetch(`https://api.marketstack.com/v1/eod?access_key=${apiKey}&symbols=${ticker}&limit=1`)
    ]);

    const tickerData = await tickerRes.json();
    const eodData = await eodRes.json();

    if (!tickerData.data || tickerData.error) {
      output.innerHTML = `<p>❌ Ticker not found. Please check the symbol and try again.</p>`;
      return;
    }

    const info = tickerData.data;
    const latest = eodData.data?.[0];

    output.innerHTML = `
      <h2>${info.name} (${info.symbol})</h2>
      <p><strong>Exchange:</strong> ${info.stock_exchange.name}</p>
      <p><strong>Country:</strong> ${info.stock_exchange.country}</p>
      ${latest ? `<p><strong>Latest Close:</strong> $${latest.close} on ${latest.date.split('T')[0]}</p>` : ""}
    `;
  } catch (err) {
    output.innerHTML = `<p>⚠️ Error fetching stock data. Please try again later.</p>`;
    console.error(err);
  }
}
