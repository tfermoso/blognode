const router = require("express").Router();
const c = require("../controllers/public-user.controller");

// GET /usuarios/:id
router.get("/:id", c.profile);

module.exports = router;
