const db = require("../db/db");

const saveCoinToUser = async (coin, userId) => {
  try {
    const formatDate = (dateStr) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return date.toISOString().slice(0, 19).replace("T", " ");
    };

    const formattedCoin = {
      ...coin,
      ath_date: formatDate(coin.ath_date),
      atl_date: formatDate(coin.atl_date),
      last_updated: formatDate(coin.last_updated),
      max_supply: coin.max_supply === "" ? null : coin.max_supply,
    };

    const insertQuery = `
      INSERT INTO coins (
        id, symbol, name, image_url, current_price, market_cap, market_cap_rank,
        fully_diluted_valuation, total_volume, high_24h, low_24h, price_change_24h,
        price_change_percentage_24h, market_cap_change_24h, market_cap_change_percentage_24h,
        circulating_supply, total_supply, max_supply, ath, ath_change_percentage,
        ath_date, atl, atl_change_percentage, atl_date, last_updated, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        symbol = VALUES(symbol),
        name = VALUES(name),
        image_url = VALUES(image_url),
        current_price = VALUES(current_price),
        market_cap = VALUES(market_cap),
        market_cap_rank = VALUES(market_cap_rank),
        fully_diluted_valuation = VALUES(fully_diluted_valuation),
        total_volume = VALUES(total_volume),
        high_24h = VALUES(high_24h),
        low_24h = VALUES(low_24h),
        price_change_24h = VALUES(price_change_24h),
        price_change_percentage_24h = VALUES(price_change_percentage_24h),
        market_cap_change_24h = VALUES(market_cap_change_24h),
        market_cap_change_percentage_24h = VALUES(market_cap_change_percentage_24h),
        circulating_supply = VALUES(circulating_supply),
        total_supply = VALUES(total_supply),
        max_supply = VALUES(max_supply),
        ath = VALUES(ath),
        ath_change_percentage = VALUES(ath_change_percentage),
        ath_date = VALUES(ath_date),
        atl = VALUES(atl),
        atl_change_percentage = VALUES(atl_change_percentage),
        atl_date = VALUES(atl_date),
        last_updated = VALUES(last_updated),
        user_id = VALUES(user_id)
    `;

    const values = [
      formattedCoin.id,
      formattedCoin.symbol,
      formattedCoin.name,
      formattedCoin.image_url || null,
      formattedCoin.current_price,
      formattedCoin.market_cap,
      formattedCoin.market_cap_rank,
      formattedCoin.fully_diluted_valuation,
      formattedCoin.total_volume,
      formattedCoin.high_24h,
      formattedCoin.low_24h,
      formattedCoin.price_change_24h,
      formattedCoin.price_change_percentage_24h,
      formattedCoin.market_cap_change_24h,
      formattedCoin.market_cap_change_percentage_24h,
      formattedCoin.circulating_supply,
      formattedCoin.total_supply,
      formattedCoin.max_supply,
      formattedCoin.ath,
      formattedCoin.ath_change_percentage,
      formattedCoin.ath_date,
      formattedCoin.atl,
      formattedCoin.atl_change_percentage,
      formattedCoin.atl_date,
      formattedCoin.last_updated,
      userId,
    ];

    await db.execute(insertQuery, values);
  } catch (error) {
    console.error("Error saving coin to user:", error);
  }
};

module.exports = saveCoinToUser;
