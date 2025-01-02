const axios = require("axios");
const headers = require("./header");

async function getCoinsList() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "gbp",
          per_page: 30,
          page: 1,
        },
        headers: {
          "x-cg-demo-api-key": "CG-J4vg6cUL3DjqsuUcDUC1sD5T",
        },
      }
    );
    console.log("Successfully fetched coins");
    return response.data;
  } catch (error) {
    console.error("Error fetching coin markets:", error);
    throw error;
  }
}

module.exports = getCoinsList;
