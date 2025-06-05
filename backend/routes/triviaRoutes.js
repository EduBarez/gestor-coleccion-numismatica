const express = require("express");
const router = express.Router();

const {
  getPreguntas,
  getPreguntaById,
  getPreguntasPorPeriodo,
  createPregunta,
  updatePregunta,
  deletePregunta,
} = require("../controllers/triviaController");

router.get("/", getPreguntas);
router.get("/periodo/:nombrePeriodo", getPreguntasPorPeriodo);
router.get("/:id", getPreguntaById);
router.post("/", createPregunta);
router.put("/:id", updatePregunta);
router.delete("/:id", deletePregunta);

module.exports = router;
