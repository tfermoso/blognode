const router = require("express").Router();
const c = require("../controllers/follows.controller");

router.post("/:id/seguir", c.follow);
router.post("/:id/dejar", c.unfollow);

module.exports = router;
