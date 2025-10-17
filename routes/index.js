const express = require("express");
const router = express.Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItem");

// Mount resource routers
router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

router.use((req, res, next) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
