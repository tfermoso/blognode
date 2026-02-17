const prisma = require("../db/prisma");

exports.home = async (req, res, next) => {
  try {
    const publicaciones = await prisma.publicacion.findMany({
      where: { estado: "publicada" },
      include: { usuario: true, categoria: true },
      orderBy: { fecha_publicacion: "desc" },
      take: 20,
    });

    res.render("index", { publicaciones, user: req.user || null });
  } catch (err) {
    next(err);
  }
};
