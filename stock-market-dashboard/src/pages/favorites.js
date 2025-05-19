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

      data.forEach(async (stock, i) => {
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

        // Chart
        const eodRes = await fetch(`https://api.marketstack.com/v1/eod?access_key=61851e5840f68d4a94391f1ee9d9a979&symbols=${stock.symbol}&limit=10`);
        const eodJson = await eodRes.json();
        const eodData = eodJson.data.reverse();

        const labels = eodData.map(d => d.date.split('T')[0]);
        const prices = eodData.map(d => d.close);

        const ctx = document.getElementById(`chart-${i}`).getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: `${stock.symbol} Closing Prices`,
              data: prices,
              borderWidth: 2,
              fill: false,
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
      });

      // ✅ Attach delete logic after all buttons are rendered
      setTimeout(() => {
        document.querySelectorAll('.deleteBtn').forEach(button => {
          button.addEventListener('click', async () => {
            const symbol = button.getAttribute('data-symbol');
            if (confirm(`Delete ${symbol} from favorites?`)) {
              const res = await fetch(`http://localhost:3001/api/favorites/${symbol}`, {
                method: 'DELETE'
              });
              const result = await res.json();
              alert(result.status || "Deleted!");
              renderFavorites(); // Refresh list
            }
          });
        });
      }, 500);
    })
    .catch(err => {
      document.getElementById('favoritesList').innerHTML =
        `<p>❌ Failed to load favorites.</p>`;
      console.error(err);
    });
}
