const express = require("express");
const router = express.Router();

const { login, createUser } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");
const clothingItemRouter = require("./clothingItem");
const userRouter = require("./users");
const auth = require("../middlewares/auth");

const {
  validateLogin,
  validateUserBody,
} = require("../middlewares/validation");

// Public
router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);
router.get("/items", getItems);

// Protected
router.use(auth);
router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

// Express 5 JSON 404 (final handler; no path)
router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
