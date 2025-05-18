export function renderAbout() {
  document.getElementById('app').innerHTML = `
    <h1>About This Project</h1>
    <p>This application uses the Marketstack API to provide real-time stock market data, including ticker info and historical prices.</p>
    <p>Built with Vite, Chart.js, and Vanilla JavaScript.</p>
  `;
}