const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Se pueden configurar opciones adicionales

// Importar controladores
const { 
  getMonedas, 
  getMonedaById, 
  createMoneda, 
  updateMoneda, 
  deleteMoneda 
} = require('../controllers/monedaController');

// Rutas CRUD para monedas
router.get('/', getMonedas); // Obtener todas las monedas
router.get('/:id', getMonedaById); // Obtener una moneda por ID
router.post('/', upload.single('fotografia'), createMoneda); // Crear una nueva moneda con imagen opcional
router.put('/:id', upload.single('fotografia'), updateMoneda); // Actualizar una moneda con imagen opcional
router.delete('/:id', deleteMoneda); // Eliminar una moneda por ID

module.exports = router;
