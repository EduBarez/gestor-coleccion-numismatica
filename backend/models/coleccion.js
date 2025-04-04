const mongoose = require('mongoose');

const coleccionSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  publica: { type: Boolean, default: false },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  creadaEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coleccion', coleccionSchema, 'Colecciones');
