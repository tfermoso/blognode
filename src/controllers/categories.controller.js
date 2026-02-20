const prisma = require("../db/prisma");

exports.list = async (req, res, next) => {
  try {
    const categorias = await prisma.categoria.findMany({ orderBy: { nombre: "asc" } });
    res.render("categories/index", { categorias, error: null });
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    await prisma.categoria.create({ data: { nombre, descripcion: descripcion?.trim() || null } });
    res.redirect("/dashboard/categorias");
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion } = req.body;
    await prisma.categoria.update({
      where: { id_categoria: id },
      data: { nombre, descripcion: descripcion?.trim() || null },
    });
    res.redirect("/dashboard/categorias");
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.categoria.delete({ where: { id_categoria: id } });
    res.redirect("/dashboard/categorias");
  } catch (e) { next(e); }
};
