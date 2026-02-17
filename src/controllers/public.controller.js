const prisma = require("../db/prisma");

exports.home = async (req, res, next) => {
  try {
    const publicaciones = await prisma.publicacion.findMany({
      where: { estado: "publicada" },
      include: { usuario: true, categoria: true },
      orderBy: { fecha_publicacion: "desc" },
      take: 20,
    });


    res.render("index", { publicaciones , user: req.user || null });
  } catch (e) { next(e); }
};

exports.postDetail = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const publicacion = await prisma.publicacion.findUnique({
      where: { id_publicacion: id },
      include: {
        usuario: true,
        categoria: true,
        comentario: {
          where: { moderado: true },
          include: { usuario: true, respuestas: { include: { usuario: true } } },
          orderBy: { fecha_comentario: "asc" },
        },
      },
    });

    if (!publicacion || publicacion.estado !== "publicada") {
      return res.status(404).send("Publicación no encontrada");
    }

    // sumar visita
    await prisma.publicacion.update({
      where: { id_publicacion: id },
      data: { numero_visitas: { increment: 1 } },
    });

    res.render("publicacion", { publicacion });
  } catch (e) { next(e); }
};

exports.userProfile = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.usuario.findUnique({
      where: { id_usuario: id },
      include: {
        publicacion: {
          where: { estado: "publicada" },
          orderBy: { fecha_publicacion: "desc" },
        },
      },
    });

    if (!user) return res.status(404).send("Usuario no encontrado");

    res.render("perfil_publico", { perfil: user });
  } catch (e) { next(e); }
};

exports.postsByCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const categoria = await prisma.categoria.findUnique({
      where: { id_categoria: id },
    });
    if (!categoria) return res.status(404).send("Categoría no encontrada");

    const publicaciones = await prisma.publicacion.findMany({
      where: { estado: "publicada", id_categoria: id },
      include: { usuario: true, categoria: true },
      orderBy: { fecha_publicacion: "desc" },
    });

    res.render("categoria", { categoria, publicaciones });
  } catch (e) { next(e); }
};
