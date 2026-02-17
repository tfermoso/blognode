const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");

exports.showLogin = (req, res) => {
  res.render("login", { error: req.flash("error")[0] || null });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) {
      req.flash("error", "Credenciales inválidas");
      return res.redirect("/auth/login");
    }

    const ok = await bcrypt.compare(password, user.contrasena);
    if (!ok) {
      req.flash("error", "Credenciales inválidas");
      return res.redirect("/auth/login");
    }

    req.session.userId = user.id_usuario; // Int
    return res.redirect("/dashboard");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
};

exports.showRegister = (req, res) => {
  res.render("register", { error: req.flash("error")[0] || null });
};

exports.register = async (req, res) => {
  const { nombre, email, password, biografia } = req.body;

  try {
    const existing = await prisma.usuario.findUnique({ where: { email } });
    if (existing) {
      req.flash("error", "Ese email ya está en uso");
      return res.redirect("/auth/register");
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.usuario.create({
      data: {
        nombre,
        email,
        contrasena: hash,
        biografia: biografia?.trim() || null,
      },
    });

    return res.redirect("/auth/login");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/"));
};
