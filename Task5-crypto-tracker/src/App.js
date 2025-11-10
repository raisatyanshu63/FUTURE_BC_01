import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [coins, setCoins] = useState([]);
  const [portfolio] = useState({
    bitcoin: 0.01,
    ethereum: 0.2,
    solana: 5,
  });

  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd"
        );
        const data = await response.json();
        setCoins(data);

        const total =
          (data.bitcoin.usd * portfolio.bitcoin) +
          (data.ethereum.usd * portfolio.ethereum) +
          (data.solana.usd * portfolio.solana);

        setTotalValue(total);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 15000);
    return () => clearInterval(interval);
  }, [portfolio]);

  return (
    <div className="App">
      <h1>💰 Crypto Portfolio Tracker</h1>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Holdings</th>
            <th>Price (USD)</th>
            <th>Value (USD)</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(portfolio).map((coin) => (
            <tr key={coin}>
              <td>{coin.toUpperCase()}</td>
              <td>{portfolio[coin]}</td>
              <td>${coins[coin]?.usd?.toLocaleString() || "Loading..."}</td>
              <td>
                $
                {coins[coin]
                  ? (coins[coin].usd * portfolio[coin]).toLocaleString()
                  : "Loading..."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>
        🔹 Total Portfolio Value: ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </h2>
      <p>Data updates every 15 seconds from CoinGecko API ⚡</p>
    </div>
  );
}

export default App;