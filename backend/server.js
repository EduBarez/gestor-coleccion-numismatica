const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const monedaRoutes = require("./routes/monedaRoutes");
const userRoutes = require("./routes/userRoutes");
const triviaRoutes = require("./routes/triviaRoutes");
const coleccionRoutes = require("./routes/coleccionRoutes");
const notificacionRoutes = require("./routes/notificacionRoutes");

// Usar rutas
app.use("/api/monedas", monedaRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/trivia", triviaRoutes);
app.use("/api/colecciones", coleccionRoutes);
app.use("/api/notifications", notificacionRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Gestor de Colecciones Numismáticas - Backend funcionando");
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores global
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
  // Conectamos a la BD
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Conexión a MongoDB establecida"))
    .catch((err) => {
      console.error("Error al conectar a MongoDB:", err);
      process.exit(1);
    });

  // Iniciar el servidor
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });

  // Manejo de errores asíncronos
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.message);
    server.close(() => process.exit(1));
  });
}

// Exportamos la app para que Supertest la use en los tests
module.exports = app;
