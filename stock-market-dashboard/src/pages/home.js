import Chart from 'chart.js/auto';

export function renderHome() {
  document.getElementById('app').innerHTML = `
    <h1>Market Overview</h1>
    <canvas id="marketChart" width="600" height="400"></canvas>
  `;
  fetchMarketData();
}

async function fetchMarketData() {
  const res = await fetch(`https://api.marketstack.com/v1/eod?access_key=61851e5840f68d4a94391f1ee9d9a979&symbols=SPY&limit=10`);
  const json = await res.json();
  const data = json.data.reverse();

  const labels = data.map(entry => entry.date.split('T')[0]);
  const prices = data.map(entry => entry.close);

  const ctx = document.getElementById('marketChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'SPY Closing Price',
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
}