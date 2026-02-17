const prisma = require("../db/prisma");

module.exports = async (req, res, next) => {
  try {
    if (!req.session?.userId) {
      res.locals.user = null;
      return next();
    }

    const user = await prisma.usuario.findUnique({
      where: { id_usuario: req.session.userId },
      select: { id_usuario: true, nombre: true, email: true, biografia: true },
    });

    res.locals.user = user || null;
    next();
  } catch (e) {
    res.locals.user = null;
    next();
  }
};
