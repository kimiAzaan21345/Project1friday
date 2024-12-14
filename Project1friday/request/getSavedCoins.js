const db = require("../db/db");

const getSavedCoins = async (userId) => {
  try {
    const [rows] = await db.execute(
      `
        SELECT * FROM coins WHERE user_id = ?;
      `,
      [userId]
    );

    console.log(`Found ${rows.length} coin(s) for user with ID ${userId}.`);
    return rows;
  } catch (error) {
    console.error("Error retrieving coins for user:", error);
  }
};

module.exports = getSavedCoins;
