const prisma = require("../db/prisma");

exports.detail = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const publicacion = await prisma.publicacion.findUnique({
      where: { id_publicacion: id },
      include: {
        usuario: true,
        categoria: true,
        comentario: {
          where: { moderado: true, id_comentario_padre: null },
          include: {
            usuario: true,
            respuestas: {
              where: { moderado: true },
              include: { usuario: true },
              orderBy: { fecha_comentario: "asc" },
            },
          },
          orderBy: { fecha_comentario: "asc" },
        },
      },
    });

    if (!publicacion || publicacion.estado !== "publicada") {
      return res.status(404).send("Publicación no encontrada");
    }

    await prisma.publicacion.update({
      where: { id_publicacion: id },
      data: { numero_visitas: { increment: 1 } },
    });

    res.render("publicacion", { publicacion });
  } catch (e) {
    next(e);
  }
};
