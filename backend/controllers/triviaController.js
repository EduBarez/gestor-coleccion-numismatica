const Trivia = require("../models/trivia");

// Obtener todas las preguntas de trivia
exports.getPreguntas = async (req, res) => {
  try {
    const preguntas = await Trivia.find();
    res.status(200).json(preguntas);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener las preguntas de trivia",
      details: error.message,
    });
  }
};

// Obtener una pregunta de trivia por ID
exports.getPreguntaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pregunta = await Trivia.findById(id);
    if (!pregunta)
      return res.status(404).json({ error: "Pregunta no encontrada" });
    res.status(200).json(pregunta);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener la pregunta", details: error.message });
  }
};

// Crear una nueva pregunta de trivia
exports.createPregunta = async (req, res) => {
  try {
    const { pregunta, opciones, respuestaCorrecta, periodo } = req.body;

    if (
      !pregunta ||
      !opciones ||
      opciones.length !== 4 ||
      !respuestaCorrecta ||
      !periodo
    ) {
      return res.status(400).json({
        error: "Faltan datos o las opciones no tienen exactamente 4 respuestas",
      });
    }

    if (!opciones.includes(respuestaCorrecta)) {
      return res.status(400).json({
        error: "La respuesta correcta debe estar dentro de las opciones",
      });
    }

    const nuevaPregunta = new Trivia({
      pregunta,
      opciones,
      respuestaCorrecta,
      periodo,
    });
    await nuevaPregunta.save();

    res.status(201).json(nuevaPregunta);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear la pregunta de trivia",
      details: error.message,
    });
  }
};

// Actualizar una pregunta de trivia por ID
exports.updatePregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const preguntaActualizada = await Trivia.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!preguntaActualizada)
      return res.status(404).json({ error: "Pregunta no encontrada" });
    res.status(200).json(preguntaActualizada);
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar la pregunta",
      details: error.message,
    });
  }
};

// Obtener preguntas de trivia por periodo
exports.getPreguntasPorPeriodo = async (req, res) => {
  try {
    const { nombrePeriodo } = req.params;
    const preguntas = await Trivia.find({ periodo: nombrePeriodo });
    res.status(200).json(preguntas);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener preguntas por periodo",
      details: error.message,
    });
  }
};

// Eliminar una pregunta de trivia por ID
exports.deletePregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const preguntaEliminada = await Trivia.findByIdAndDelete(id);
    if (!preguntaEliminada)
      return res.status(404).json({ error: "Pregunta no encontrada" });
    res.status(200).json({ message: "Pregunta eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar la pregunta", details: error.message });
  }
};
