const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno desde .env

const app = express();

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Reemplazo de body-parser para analizar JSON

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conexión a MongoDB establecida');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err);
    setTimeout(connectDB, 5000); // Reintentar conexión después de 5 segundos
  }
};
connectDB();

// Importar rutas
const monedaRoutes = require('./routes/monedaRoutes');
const userRoutes = require('./routes/userRoutes');

// Usar rutas
app.use('/api/monedas', monedaRoutes); // Ruta base para las monedas
app.use('/api/usuarios', userRoutes); // Ruta base para los usuarios

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Gestor de Colecciones Numismáticas - Backend funcionando');
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor', details: err.message });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Manejo global de errores
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});
