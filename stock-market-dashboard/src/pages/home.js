import Chart from 'chart.js/auto';

export function renderHome() {
  document.getElementById('app').innerHTML = `
    <h1>📊 Market Overview</h1>
    <canvas id="overviewChart" width="600" height="300"></canvas>
  `;

  drawMarketChart();
}

async function drawMarketChart() {
  const symbols = ['AAPL', 'MSFT', 'AMZN'];
  const apiKey = "61851e5840f68d4a94391f1ee9d9a979";

  const datasets = await Promise.all(symbols.map(async (symbol) => {
    const res = await fetch(`https://api.marketstack.com/v1/eod?access_key=${apiKey}&symbols=${symbol}&limit=10`);
    const json = await res.json();
    const eod = json.data.reverse();

    return {
      label: symbol,
      data: eod.map(d => d.close),
      borderWidth: 2,
      fill: false,
      tension: 0.3
    };
  }));

  const labels = (await fetch(`https://api.marketstack.com/v1/eod?access_key=${apiKey}&symbols=AAPL&limit=10`)
    .then(res => res.json()))
    .data.reverse().map(d => d.date.split('T')[0]);

  const ctx = document.getElementById('overviewChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets
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
