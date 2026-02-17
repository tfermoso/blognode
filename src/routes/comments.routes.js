const router = require("express").Router();
const c = require("../controllers/comments.controller");

// POST /publicaciones/:id/comentarios
router.post("/:id/comentarios", c.create);

// POST /publicaciones/comentarios/:id/responder
router.post("/comentarios/:id/responder", c.reply);

// POST /publicaciones/comentarios/:id/borrar
router.post("/comentarios/:id/borrar", c.remove);

module.exports = router;
