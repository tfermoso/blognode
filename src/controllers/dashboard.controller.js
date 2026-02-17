const prisma = require("../db/prisma");

exports.dashboard = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    const [me, stats] = await Promise.all([
      prisma.usuario.findUnique({
        where: { id_usuario: userId },
        select: { id_usuario: true, nombre: true, email: true, biografia: true },
      }),
      prisma.publicacion.count({ where: { id_usuario: userId } }),
    ]);

    res.render("dashboard", { me, totalPublicaciones: stats });
  } catch (e) { next(e); }
};
