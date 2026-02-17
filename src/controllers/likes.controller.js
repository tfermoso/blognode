const prisma = require("../db/prisma");

exports.toggle = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const id_publicacion = Number(req.params.id);

    const existing = await prisma.megusta_publicacion.findUnique({
      where: { id_usuario_id_publicacion: { id_usuario: userId, id_publicacion } },
    });

    if (existing) {
      await prisma.megusta_publicacion.delete({
        where: { id_usuario_id_publicacion: { id_usuario: userId, id_publicacion } },
      });
    } else {
      await prisma.megusta_publicacion.create({
        data: { id_usuario: userId, id_publicacion },
      });
    }

    res.redirect(`/publicaciones/${id_publicacion}`);
  } catch (e) { next(e); }
};
