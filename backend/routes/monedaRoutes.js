const express = require('express');
const router = express.Router();

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
router.post('/', createMoneda); // Crear una nueva moneda
router.put('/:id', updateMoneda); // Actualizar una moneda por ID
router.delete('/:id', deleteMoneda); // Eliminar una moneda por ID

module.exports = router;
