const db = require("../db/db");

const deleteSavedCoin = async (coinId, userId) => {
  try {
    const result = await db.execute(
      `
        DELETE FROM coins WHERE id = ? AND user_id = ?;
      `,
      [coinId, userId]
    );

    if (result[0].affectedRows > 0) {
      console.log(
        `Successfully deleted coin with ID ${coinId} for user with ID ${userId}.`
      );
    } else {
      console.log(
        `No coin are found with ID ${coinId} for user with ID ${userId}.`
      );
    }
  } catch (error) {
    console.error("Error deleting coin for user:", error);
  }
};

module.exports = deleteSavedCoin;
