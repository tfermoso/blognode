-- CreateEnum
CREATE TYPE "estado_publicacion" AS ENUM ('borrador', 'publicada', 'archivada');

-- CreateTable
CREATE TABLE "comentario" (
    "id_comentario" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_publicacion" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "fecha_comentario" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_edicion" TIMESTAMPTZ(6),
    "moderado" BOOLEAN NOT NULL DEFAULT false,
    "puntuacion" INTEGER NOT NULL DEFAULT 0,
    "id_comentario_padre" INTEGER,

    CONSTRAINT "comentario_pkey" PRIMARY KEY ("id_comentario")
);

-- CreateTable
CREATE TABLE "publicacion" (
    "id_publicacion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_categoria" INTEGER,
    "titulo" VARCHAR(255) NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_publicacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "estado" "estado_publicacion" NOT NULL DEFAULT 'borrador',
    "numero_visitas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "publicacion_pkey" PRIMARY KEY ("id_publicacion")
);

-- CreateTable
CREATE TABLE "publicacion_etiquetas" (
    "id_publicacion" INTEGER NOT NULL,
    "etiqueta" VARCHAR(50) NOT NULL,

    CONSTRAINT "pk_publicacion_etiquetas" PRIMARY KEY ("id_publicacion","etiqueta")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "fecha_registro" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "biografia" TEXT,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "usuario_telefonos" (
    "id_usuario" INTEGER NOT NULL,
    "telefono" VARCHAR(30) NOT NULL,

    CONSTRAINT "pk_usuario_telefonos" PRIMARY KEY ("id_usuario","telefono")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "megusta_publicacion" (
    "id_usuario" INTEGER NOT NULL,
    "id_publicacion" INTEGER NOT NULL,
    "fecha_megusta" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_megusta_publicacion" PRIMARY KEY ("id_usuario","id_publicacion")
);

-- CreateTable
CREATE TABLE "seguimiento" (
    "id_seguidor" INTEGER NOT NULL,
    "id_seguido" INTEGER NOT NULL,
    "fecha_seguimiento" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_seguimiento" PRIMARY KEY ("id_seguidor","id_seguido")
);

-- CreateIndex
CREATE INDEX "idx_comentario_id_publicacion" ON "comentario"("id_publicacion");

-- CreateIndex
CREATE INDEX "idx_comentario_id_usuario" ON "comentario"("id_usuario");

-- CreateIndex
CREATE INDEX "idx_comentario_id_padre" ON "comentario"("id_comentario_padre");

-- CreateIndex
CREATE INDEX "idx_publicacion_id_usuario" ON "publicacion"("id_usuario");

-- CreateIndex
CREATE INDEX "idx_publicacion_id_categoria" ON "publicacion"("id_categoria");

-- CreateIndex
CREATE INDEX "idx_publicacion_etiquetas_id_pub" ON "publicacion_etiquetas"("id_publicacion");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE INDEX "idx_usuario_telefonos_id_usuario" ON "usuario_telefonos"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "uq_categoria_nombre" ON "categoria"("nombre");

-- CreateIndex
CREATE INDEX "idx_megusta_id_publicacion" ON "megusta_publicacion"("id_publicacion");

-- CreateIndex
CREATE INDEX "idx_megusta_id_usuario" ON "megusta_publicacion"("id_usuario");

-- CreateIndex
CREATE INDEX "idx_seguimiento_id_seguidor" ON "seguimiento"("id_seguidor");

-- CreateIndex
CREATE INDEX "idx_seguimiento_id_seguido" ON "seguimiento"("id_seguido");

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_id_comentario_padre_fkey" FOREIGN KEY ("id_comentario_padre") REFERENCES "comentario"("id_comentario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "fk_comentario_publicacion" FOREIGN KEY ("id_publicacion") REFERENCES "publicacion"("id_publicacion") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comentario" ADD CONSTRAINT "fk_comentario_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publicacion" ADD CONSTRAINT "fk_publicacion_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publicacion" ADD CONSTRAINT "fk_publicacion_categoria" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id_categoria") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publicacion_etiquetas" ADD CONSTRAINT "fk_publicacion_etiquetas_publicacion" FOREIGN KEY ("id_publicacion") REFERENCES "publicacion"("id_publicacion") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_telefonos" ADD CONSTRAINT "fk_usuario_telefonos_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "megusta_publicacion" ADD CONSTRAINT "fk_megusta_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "megusta_publicacion" ADD CONSTRAINT "fk_megusta_publicacion" FOREIGN KEY ("id_publicacion") REFERENCES "publicacion"("id_publicacion") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seguimiento" ADD CONSTRAINT "fk_seguimiento_seguidor" FOREIGN KEY ("id_seguidor") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seguimiento" ADD CONSTRAINT "fk_seguimiento_seguido" FOREIGN KEY ("id_seguido") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;
