const prisma = require("../db/prisma");

exports.create = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const id_publicacion = Number(req.params.id);
    const { texto } = req.body;

    await prisma.comentario.create({
      data: {
        id_usuario: userId,
        id_publicacion,
        texto,
        moderado: true, // en dev lo dejamos true; en real podrías moderar
      },
    });

    res.redirect(`/publicaciones/${id_publicacion}`);
  } catch (e) { next(e); }
};

exports.reply = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const id_padre = Number(req.params.id);
    const { texto, id_publicacion } = req.body;

    await prisma.comentario.create({
      data: {
        id_usuario: userId,
        id_publicacion: Number(id_publicacion),
        id_comentario_padre: id_padre,
        texto,
        moderado: true,
      },
    });

    res.redirect(`/publicaciones/${id_publicacion}`);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const id = Number(req.params.id);

    const cmt = await prisma.comentario.findUnique({ where: { id_comentario: id } });
    if (!cmt) return res.status(404).send("Comentario no encontrado");
    if (cmt.id_usuario !== userId) return res.status(403).send("No autorizado");

    await prisma.comentario.delete({ where: { id_comentario: id } });

    res.redirect(`/publicaciones/${cmt.id_publicacion}`);
  } catch (e) { next(e); }
};
