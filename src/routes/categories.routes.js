const router = require("express").Router();
const c = require("../controllers/categories.controller");

router.get("/", c.list);
router.post("/", c.create);
router.post("/:id", c.update);
router.post("/:id/borrar", c.remove);

module.exports = router;
