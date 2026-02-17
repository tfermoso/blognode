const prisma = require("../db/prisma");

exports.profile = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const perfil = await prisma.usuario.findUnique({
      where: { id_usuario: id },
      include: {
        publicacion: {
          where: { estado: "publicada" },
          orderBy: { fecha_publicacion: "desc" },
        },
      },
    });

    if (!perfil) return res.status(404).send("Usuario no encontrado");

    res.render("perfil_publico", { perfil });
  } catch (e) {
    next(e);
  }
};
