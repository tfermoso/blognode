const prisma = require("../db/prisma");

exports.follow = async (req, res, next) => {
  try {
    const me = req.session.userId;
    const other = Number(req.params.id);
    if (me === other) return res.redirect(`/usuarios/${other}`);

    await prisma.seguimiento.create({
      data: { id_seguidor: me, id_seguido: other },
    }).catch(() => {}); // por si ya existe (PK compuesta)

    res.redirect(`/usuarios/${other}`);
  } catch (e) { next(e); }
};

exports.unfollow = async (req, res, next) => {
  try {
    const me = req.session.userId;
    const other = Number(req.params.id);

    await prisma.seguimiento.delete({
      where: { id_seguidor_id_seguido: { id_seguidor: me, id_seguido: other } },
    }).catch(() => {});

    res.redirect(`/usuarios/${other}`);
  } catch (e) { next(e); }
};
