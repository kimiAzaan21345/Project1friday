const db = require("../db/db");
const bcrypt = require("bcrypt");

async function registerAcc(username, password, confirmPassword) {
  if (password !== confirmPassword) {
    throw new Error("Passwords not matching");
  }

  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  if (rows.length > 0) {
    throw new Error("Username is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
    username,
    hashedPassword,
  ]);
}

module.exports = {
  registerAcc,
};
