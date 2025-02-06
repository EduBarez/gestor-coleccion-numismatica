const mongoose = require('mongoose');

const triviaSchema = new mongoose.Schema({
  pregunta: {
    type: String,
    required: [true, 'La pregunta es obligatoria'],
    trim: true,
  },
  opciones: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length === 4;
      },
      message: 'Debe haber exactamente 4 opciones de respuesta.',
    },
    required: [true, 'Debe haber 4 opciones de respuesta.'],
  },
  respuestaCorrecta: {
    type: String,
    required: [true, 'Debe haber una respuesta correcta'],
  },
  monedaAsociada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Moneda',
    required: false, // Es opcional
  },
  periodo: {
    type: String,
    enum: ['Antigüedad', 'Imperio Romano', 'Edad Media', 'Edad Moderna', 'Edad Contemporánea'],
    required: false,
  },
});

module.exports = mongoose.model('Trivia', triviaSchema, 'PreguntasTrivia');
