export function renderAbout() {
  document.getElementById('app').innerHTML = `
    <h1>About This App</h1>
    <p>This app uses the Marketstack API and Supabase to show live stock data, favorites, and market stats.</p>

    <details open>
      <summary><strong>Supported Stock Exchanges</strong></summary>
      <ul id="exchangeList">Loading...</ul>
    </details>

    <details>
      <summary><strong>Supported Currencies</strong></summary>
      <ul id="currencyList">Loading...</ul>
    </details>

    <details>
      <summary><strong>Supported Timezones</strong></summary>
      <ul id="timezoneList">Loading...</ul>
    </details>
  `;

  const apiKey = "61851e5840f68d4a94391f1ee9d9a979";

  fetch(`https://api.marketstack.com/v1/exchanges?access_key=${apiKey}&limit=5`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('exchangeList').innerHTML = data.data.map(e =>
        `<li><strong>${e.name}</strong> (${e.acronym}) — ${e.city}, ${e.country}</li>`
      ).join('');
    });

  fetch(`https://api.marketstack.com/v1/currencies?access_key=${apiKey}&limit=5`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('currencyList').innerHTML = data.data.map(c =>
        `<li>${c.code} — ${c.symbol}</li>`
      ).join('');
    });

  fetch(`https://api.marketstack.com/v1/timezones?access_key=${apiKey}&limit=5`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('timezoneList').innerHTML = data.data.map(t =>
        `<li>${t.timezone}</li>`
      ).join('');
    });
}
