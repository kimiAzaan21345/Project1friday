const express = require("express");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const { registerAcc } = require("../auth/register");
const getCoinsList = require("../request/getCoinList");
const saveCoinToUser = require("../request/saveCoinToUser");
const getSavedCoins = require("../request/getSavedCoins");
const deleteSavedCoin = require("../request/deleteSavedCoin");
const { getCoinsByName } = require("../request/getCoinsByName");

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/coins");
  }
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  [
    check("username").not().isEmpty().withMessage("Username is required"),
    check("password").not().isEmpty().withMessage("Password is required"),
  ],
  passport.authenticate("local", {
    successRedirect: "/coins",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("sucessful", "You have been logged out.");
    res.redirect("/");
  });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  [
    check("username").not().isEmpty().withMessage("Username is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password has to be at least 6 characters"),
    check("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("please apply matching passwords"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash(
        "error",
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
      return res.redirect("/register");
    }

    const { username, password, confirmPassword } = req.body;

    try {
      await registerAcc(username, password, confirmPassword);

      req.flash("success", "Registration authenticated, Please log in.");
      res.redirect("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      req.flash("error", error.message);
      res.redirect("/register");
    }
  }
);

router.get("/search", isAuthenticated, (req, res) => {
  res.render("search", {
    query: "",
    results: [],
  });
});

router.post(
  "/search",
  [
    check("coin_name")
      .not()
      .isEmpty()
      .withMessage("Please input exact coin name")
      .trim()
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash(
        "error",
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
      return res.redirect("/search");
    }

    const { coin_name } = req.body;

    try {
      const coins = await getCoinsByName(coin_name);

      res.render("search", {
        results: coins,
        query: coin_name,
      });
    } catch (error) {
      console.error("Error searching for coins:", error);
      req.flash("error", "Server error during search.");
      res.redirect("/search");
    }
  }
);

router.get("/coins", isAuthenticated, async (req, res) => {
  try {
    const coins = await getCoinsList();
    res.render("coins", { coins });
  } catch (error) {
    req.flash("error", "Error fetching coins data.");
    res.render("coins", { coins: [] });
  }
});

router.post("/coins", async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user.id;

    if (!data.coinId || !data.symbol || !data.name) {
      req.flash("error", "Missing required coin data");
      return res.redirect("/coins");
    }

    const coinData = {
      id: data.coinId,
      symbol: data.symbol,
      name: data.name,
      image_url: data.image_url,
      current_price: data.current_price,
      market_cap: data.market_cap,
      market_cap_rank: data.market_cap_rank,
      fully_diluted_valuation: data.fully_diluted_valuation,
      total_volume: data.total_volume,
      high_24h: data.high_24h,
      low_24h: data.low_24h,
      price_change_24h: data.price_change_24h,
      price_change_percentage_24h: data.price_change_percentage_24h,
      market_cap_change_24h: data.market_cap_change_24h,
      market_cap_change_percentage_24h: data.market_cap_change_percentage_24h,
      circulating_supply: data.circulating_supply,
      total_supply: data.total_supply,
      max_supply: data.max_supply,
      ath: data.ath,
      ath_change_percentage: data.ath_change_percentage,
      ath_date: data.ath_date,
      atl: data.atl,
      atl_change_percentage: data.atl_change_percentage,
      atl_date: data.atl_date,
      last_updated: data.last_updated,
    };

    await saveCoinToUser(coinData, userId);

    req.flash("success", "Coin saved successfully!");
    res.redirect("/coins");
  } catch (error) {
    console.error("Error saving coin data:", error);
    req.flash("error", "An error occurred while saving the coin.");
    res.redirect("/coins");
  }
});

router.get("/user", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const savedCoins = await getSavedCoins(userId);

    if (savedCoins.length === 0) {
      req.flash("info", "You have no saved coins yet.");
    }

    res.render("user", {
      coins: savedCoins || [],
      flashMessages: req.flash(),
    });
  } catch (error) {
    console.error("Error retrieving user coins:", error);
    req.flash("error", "There was an error retrieving your coins.");
    res.redirect("/user");
  }
});

router.post("/user", async (req, res) => {
  try {
    const { coinId } = req.body;
    const userId = req.user.id;

    if (!coinId) {
      req.flash("error", "Coin ID is required to delete.");
      return res.redirect("/user");
    }

    await deleteSavedCoin(coinId, userId);

    req.flash("success", "Coin deleted successfully!");
    res.redirect("/user");
  } catch (error) {
    console.error("Error deleting coin:", error);
    req.flash("error", "An error occurred while deleting the coin.");
    res.redirect("/user");
  }
});

module.exports = router;
