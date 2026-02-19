const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const {
  validateClothingItemBody,
  validateItemId,
} = require("../middlewares/validation");

// ✅ PUBLIC
router.get("/", getItems);

// ✅ PROTECTED (everything below requires JWT)
router.use(auth);

router.post("/", validateClothingItemBody, createItem);
router.delete("/:itemId", validateItemId, deleteItem);

router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
