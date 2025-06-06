const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const monedaRoutes = require("./routes/monedaRoutes");
const userRoutes = require("./routes/userRoutes");
const triviaRoutes = require("./routes/triviaRoutes");
const coleccionRoutes = require("./routes/coleccionRoutes");
const notificacionRoutes = require("./routes/notificacionRoutes");
const rankingRoutes = require("./routes/rankingRoutes");

app.use("/api/monedas", monedaRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/trivia", triviaRoutes);
app.use("/api/colecciones", coleccionRoutes);
app.use("/api/notifications", notificacionRoutes);
app.use("/api/ranking", rankingRoutes);

app.get("/", (req, res) => {
  res.send("Gestor de Colecciones Numismáticas - Backend funcionando");
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Ocurrió un error en el servidor", details: err.message });
});

/**
 * Si se ejecuta con `node server.js`, conectamos y levantamos el servidor.
 * Si se importa (por ejemplo, en los tests), no hacemos nada aquí.
 */
if (require.main === module) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Conexión a MongoDB establecida"))
    .catch((err) => {
      console.error("Error al conectar a MongoDB:", err);
      process.exit(1);
    });

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });

  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.message);
    server.close(() => process.exit(1));
  });
}

module.exports = app;
