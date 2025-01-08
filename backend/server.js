const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno desde .env

const app = express();

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Reemplazo de body-parser para analizar JSON

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1); // Termina el proceso si falla la conexión
  });

// Importar rutas
const monedaRoutes = require('./routes/monedaRoutes');

// Usar rutas
app.use('/api/monedas', monedaRoutes); // Ruta base para las monedas

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Gestor de Colecciones Numismáticas - Backend funcionando');
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

