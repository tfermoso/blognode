const prisma = require("../db/prisma");

exports.myPosts = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    const publicaciones = await prisma.publicacion.findMany({
      where: { id_usuario: userId },
      include: { categoria: true },
      orderBy: { fecha_publicacion: "desc" },
    });

    res.render("posts/index", { publicaciones });
  } catch (e) { next(e); }
};

exports.newForm = async (req, res, next) => {
  try {
    const categorias = await prisma.categoria.findMany({ orderBy: { nombre: "asc" } });
    res.render("posts/form", { modo: "crear", categorias, publicacion: null, error: null });
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const { titulo, contenido, id_categoria, estado, etiquetas } = req.body;

    const pub = await prisma.publicacion.create({
      data: {
        id_usuario: userId,
        titulo,
        contenido,
        estado: estado || "borrador",
        id_categoria: id_categoria ? Number(id_categoria) : null,
      },
    });

    // etiquetas (string csv) opcional
    if (etiquetas?.trim()) {
      const tags = etiquetas.split(",").map(t => t.trim()).filter(Boolean).slice(0, 20);
      if (tags.length) {
        await prisma.publicacion_etiquetas.createMany({
          data: tags.map(tag => ({ id_publicacion: pub.id_publicacion, etiqueta: tag })),
          skipDuplicates: true,
        });
      }
    }

    res.redirect("/dashboard/publicaciones");
  } catch (e) { next(e); }
};

exports.editForm = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const id = Number(req.params.id);

    const [categorias, publicacion, etiquetas] = await Promise.all([
      prisma.categoria.findMany({ orderBy: { nombre: "asc" } }),
      prisma.publicacion.findFirst({ where: { id_publicacion: id, id_usuario: userId } }),
      prisma.publicacion_etiquetas.findMany({ where: { id_publicacion: id } }),
    ]);

    if (!publicacion) return res.status(404).send("No encontrada");

    res.render("posts/form", {
      modo: "editar",
      categorias,
      publicacion: { ...publicacion, etiquetas: etiquetas.map(e => e.etiqueta).join(", ") },
      error: null,
    });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const id = Number(req.params.id);
    const { titulo, contenido, id_categoria, estado, etiquetas } = req.body;

    const updated = await prisma.publicacion.updateMany({
      where: { id_publicacion: id, id_usuario: userId },
      data: {
        titulo,
        contenido,
        estado: estado || "borrador",
        id_categoria: id_categoria ? Number(id_categoria) : null,
        fecha_actualizacion: new Date(),
      },
    });

    if (updated.count === 0) return res.status(404).send("No encontrada");

    // actualizar etiquetas: simple (borrar y recrear)
    await prisma.publicacion_etiquetas.deleteMany({ where: { id_publicacion: id } });
    if (etiquetas?.trim()) {
      const tags = etiquetas.split(",").map(t => t.trim()).filter(Boolean).slice(0, 20);
      if (tags.length) {
        await prisma.publicacion_etiquetas.createMany({
          data: tags.map(tag => ({ id_publicacion: id, etiqueta: tag })),
          skipDuplicates: true,
        });
      }
    }

    res.redirect("/dashboard/publicaciones");
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const id = Number(req.params.id);

    await prisma.publicacion.deleteMany({
      where: { id_publicacion: id, id_usuario: userId },
    });

    res.redirect("/dashboard/publicaciones");
  } catch (e) { next(e); }
};
exports.show = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const id = Number(req.params.id);

    const publicacion = await prisma.publicacion.findFirst({
      where: { id_publicacion: id, id_usuario: userId },
      include: { categoria: true, publicacion_etiquetas: true },
    });

    if (!publicacion) return res.status(404).send("No encontrada");

    res.render("posts/show", { publicacion }); // crea esta vista
  } catch (e) {
    next(e);
  }
};

