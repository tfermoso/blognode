const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const { requireAuth } = require("./middlewares/auth");

// Rutas    
const publicRoutes = require("./routes/public.routes");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const postsRoutes = require("./routes/posts.routes");
const categoriesRoutes = require("./routes/categories.routes");
const commentsRoutes = require("./routes/comments.routes");
const likesRoutes = require("./routes/likes.routes");
const followsRoutes = require("./routes/follows.routes");
const publicUsersRoutes = require("./routes/public-user.routes");
const publicPostsRoutes = require("./routes/public-post.routes");


const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use("/", publicRoutes);
app.use("/auth", authRoutes);

app.use("/dashboard", requireAuth, dashboardRoutes);
app.use("/dashboard/publicaciones", requireAuth, postsRoutes);
app.use("/dashboard/categorias", requireAuth, categoriesRoutes);

app.use("/publicaciones", requireAuth, commentsRoutes); // comentar (POST)
app.use("/publicaciones", requireAuth, likesRoutes);    // like/unlike (POST)

app.use("/usuarios", publicUsersRoutes);               // ver perfil público
app.use("/publicaciones", publicPostsRoutes);       // ver detalle público
app.use("/usuarios", requireAuth, followsRoutes);      // seguir/unfollow (POST)

module.exports = app;
