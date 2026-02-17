const router = require("express").Router();
const c = require("../controllers/likes.controller");

// POST /publicaciones/:id/like  (toggle)
router.post("/:id/like", c.toggle);

module.exports = router;
