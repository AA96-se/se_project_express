const express = require("express");
const router = express.Router();

const { login, createUser } = require("../controllers/users");
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

// Items:
// - GET /items is public (handled in clothingItemRouter)
// - everything else under /items is protected (also handled in clothingItemRouter)
router.use("/items", clothingItemRouter);

// Everything else protected
router.use(auth);
router.use("/users", userRouter);

// 404
router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
