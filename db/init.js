const initDb = async () => {
  const mysql = require("mysql2/promise");

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to the database!");

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Users table created or already exists.");

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS coins (
        id VARCHAR(255) PRIMARY KEY,  
        symbol VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        image_url VARCHAR(255),
        current_price DECIMAL(20, 8),
        market_cap BIGINT,
        market_cap_rank INT,
        fully_diluted_valuation BIGINT,
        total_volume BIGINT,
        high_24h DECIMAL(20, 8),
        low_24h DECIMAL(20, 8),
        price_change_24h DECIMAL(20, 8),
        price_change_percentage_24h DECIMAL(10, 2),
        market_cap_change_24h BIGINT,
        market_cap_change_percentage_24h DECIMAL(10, 2),
        circulating_supply DECIMAL(20, 8),
        total_supply DECIMAL(20, 8),
        max_supply DECIMAL(20, 8),
        ath DECIMAL(20, 8),
        ath_change_percentage DECIMAL(10, 2),
        ath_date DATETIME,
        atl DECIMAL(20, 8),
        atl_change_percentage DECIMAL(10, 2),
        atl_date DATETIME,
        last_updated DATETIME,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log("Coins table is created or already in use with user association.");

    await connection.end();
    console.log("Database setup completed!");
  } catch (error) {
    console.error("Error setting up the database:", error);
  }
};

module.exports = initDb;
