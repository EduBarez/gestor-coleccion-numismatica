const mongoose = require('mongoose');

const coleccionSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  publica: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creadaEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coleccion', coleccionSchema, 'Colecciones');
