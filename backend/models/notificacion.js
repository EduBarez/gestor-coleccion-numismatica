const mongoose = require("mongoose");

const NotificacionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, "El campo userId es obligatorio"],
  },
  message: {
    type: String,
    required: [true, "El texto de la notificación es obligatorio"],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "La fecha de la notificación es obligatoria"],
  },
  viewed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model(
  "Notificacion",
  NotificacionSchema,
  "Notificaciones"
);
