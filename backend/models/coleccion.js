const mongoose = require("mongoose");
const ColeccionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, default: "" },
  publica: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  monedas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Moneda" }],
  creadaEn: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Coleccion", ColeccionSchema, "Colecciones");
