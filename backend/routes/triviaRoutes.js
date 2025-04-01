const express = require('express');
const router = express.Router();

// Importar controladores de trivia
const { 
  getPreguntas, 
  getPreguntaById, 
  getPreguntasPorPeriodo,
  createPregunta, 
  updatePregunta, 
  deletePregunta 
} = require('../controllers/triviaController');

// Rutas para la gestión de preguntas de trivia
router.get('/', getPreguntas); // Obtener todas las preguntas
router.get('/periodo/:nombrePeriodo', getPreguntasPorPeriodo); // Obtener preguntas por periodo
router.get('/:id', getPreguntaById); // Obtener una pregunta por ID
router.post('/', createPregunta); // Crear una nueva pregunta
router.put('/:id', updatePregunta); // Actualizar una pregunta por ID
router.delete('/:id', deletePregunta); // Eliminar una pregunta por ID

module.exports = router;
