const router = require("express").Router();
const c = require("../controllers/auth.controller");

router.get("/login", c.showLogin);
router.post("/login", c.login);
router.get("/register", c.showRegister);
router.post("/register", c.register);
router.post("/logout", c.logout);

module.exports = router;
