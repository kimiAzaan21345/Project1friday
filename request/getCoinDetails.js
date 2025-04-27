const axios = require("axios");
const headers = require("./header");

async function getCoinDetails(coinId) {
  const coinUrl = `https://api.coingecko.com/api/v3/coins/${coinId}`;
  const chartUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`;

  try {
    const [coinRes, chartRes] = await Promise.all([
      axios.get(coinUrl, { headers: headers.headers }),
      axios.get(chartUrl, {
        headers: headers.headers,
        params: {
          vs_currency: "gbp",
          days: 30,
        },
      }),
    ]);

    return {
      details: coinRes.data,
      chart: chartRes.data,
    };
  } catch (err) {
    console.error("Error fetching detailed coin data:", err);
    throw err;
  }
}

module.exports = getCoinDetails;
