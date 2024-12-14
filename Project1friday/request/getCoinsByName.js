const db = require("../db/db");

const getCoinsByName = async (name) => {
  try {
    const [rows] = await db.execute("SELECT * FROM coins WHERE name LIKE ?", [
      `%${name}%`,
    ]);
    return rows;
  } catch (error) {
    console.error("Error fetching coins by name:", error);
    throw new Error("Database query failed");
  }
};

module.exports = {
  getCoinsByName,
};
