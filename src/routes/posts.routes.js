const router = require("express").Router();
const c = require("../controllers/posts.controller");

router.get("/", c.myPosts);
router.get("/nueva", c.newForm);
router.post("/", c.create);

router.get("/:id/editar", c.editForm);
router.post("/:id", c.update);
router.post("/:id/borrar", c.remove);

// 👇 SIEMPRE al final
router.get("/:id", c.show);

module.exports = router;
