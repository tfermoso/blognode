const router = require("express").Router();
const c = require("../controllers/public.controller");

router.get("/", c.home);
router.get("/publicaciones/:id", c.postDetail);
router.get("/usuarios/:id", c.userProfile);
router.get("/categorias/:id", c.postsByCategory);

module.exports = router;
