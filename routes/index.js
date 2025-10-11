const express = require("express");
const router = express.Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItem");

// Mount resource routers
router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

// 404 handler (Express 5)
router.all("*", (req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
