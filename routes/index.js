const express = require("express");
const router = express.Router();

const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItem");

// Auth routes (Step 4)
router.post("/signin", login);
router.post("/signup", createUser);

// Resource routers
router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

// Express 5 JSON 404
router.all("*", (req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
