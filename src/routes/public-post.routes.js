const router = require("express").Router();
const c = require("../controllers/public-post.controller");

// GET /publicaciones/:id
router.get("/:id", c.detail);

module.exports = router;
