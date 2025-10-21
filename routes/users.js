const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

/**
 * Step 7 & 8:
 * - GET  /users/me      -> getCurrentUser
 * - PATCH /users/me     -> updateCurrentUser (name, avatar only)
 * Note: These routes are protected by auth in routes/index.js
 */

router.get("/me", getCurrentUser);
router.patch("/me", updateCurrentUser);

module.exports = router;
