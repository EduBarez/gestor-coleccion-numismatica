const mongoose = require("mongoose");

const RankingSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  puntuacion: { type: Number, required: true },
  aciertos: { type: Number, required: true },
  totalPreguntas: { type: Number, required: true },
  tiempoSegundos: { type: Number, required: true },
  periodo: { type: String, default: null },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ranking", RankingSchema, "Rankings");
