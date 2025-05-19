import Chart from 'chart.js/auto';

export function renderFavorites() {
  document.getElementById('app').innerHTML = `
    <h1>⭐ Saved Favorites</h1>
    <div id="favoritesList">Loading...</div>
  `;

  fetch('http://localhost:3001/api/favorites')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('favoritesList');

      if (!data || data.length === 0) {
        list.innerHTML = '<p>No favorites found.</p>';
        return;
      }

      list.innerHTML = ''; // Clear loading text

      data.forEach((stock, i) => {
        const section = document.createElement('section');
        section.classList.add('favorite-entry');
        section.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3>${stock.symbol} — ${stock.name}</h3>
            <button class="deleteBtn" data-symbol="${stock.symbol}">🗑️</button>
          </div>
          <canvas id="chart-${i}" width="400" height="200"></canvas>
        `;
        list.appendChild(section);

        // Load EOD data and render chart
        loadChart(stock.symbol, i);
      });

      // Delete button handler
      list.addEventListener('click', async (e) => {
        if (e.target.classList.contains('deleteBtn')) {
          const symbol = e.target.getAttribute('data-symbol');
          if (confirm(`Delete ${symbol} from favorites?`)) {
            await fetch(`http://localhost:3001/api/favorites/${symbol}`, {
              method: 'DELETE'
            });
            renderFavorites(); // Reload list
          }
        }
      });
    })
    .catch(err => {
      document.getElementById('favoritesList').innerHTML =
        `<p>❌ Failed to load favorites.</p>`;
      console.error(err);
    });
}

async function loadChart(symbol, chartId) {
  try {
    const res = await fetch(`https://api.marketstack.com/v1/eod?access_key=61851e5840f68d4a94391f1ee9d9a979&symbols=${symbol}&limit=10`);
    const json = await res.json();
    const eodData = json.data.reverse();

    if (!eodData || eodData.length === 0) {
      console.warn(`No EOD data for ${symbol}`);
      return;
    }

    const labels = eodData.map(d => d.date.split('T')[0]);
    const prices = eodData.map(d => d.close);

    const ctx = document.getElementById(`chart-${chartId}`);
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: `${symbol} Closing Prices`,
            data: prices,
            borderWidth: 2,
            borderColor: '#0070f3',
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    }
  } catch (error) {
    console.error(`Chart error for ${symbol}:`, error);
  }
}
