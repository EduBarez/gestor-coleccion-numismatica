const mongoose = require("mongoose");

const MonedaSchema = new mongoose.Schema({
  fotografia: {
    type: String,
    required: [true, "La fotografía de la moneda es obligatoria"],
    trim: true,
  },
  nombre: {
    type: String,
    required: [true, "El nombre de la moneda es obligatorio"],
    trim: true,
  },
  valor: {
    type: String,
    required: [true, "El valor de la moneda es obligatorio"],
    trim: true,
  },
  autoridad_emisora: {
    type: String,
    required: [true, "La autoridad emisora es obligatoria"],
    trim: true,
  },
  ceca: {
    type: String,
    default: "Desconocida",
    trim: true,
  },
  datacion: {
    type: String,
    required: [true, "La datación es obligatoria"],
    trim: true,
  },
  estado_conservacion: {
    type: String,
    required: [true, "El estado de conservación es obligatorio"],
    trim: true,
  },
  metal: {
    type: String,
    required: [true, "El metal de la moneda es obligatorio"],
    trim: true,
  },
  peso: {
    type: Number,
    required: [true, "El peso de la moneda es obligatorio"],
    min: [0, "El peso debe ser mayor a 0"],
  },
  diametro: {
    type: Number,
    required: [true, "El diámetro de la moneda es obligatorio"],
    min: [0, "El diámetro debe ser mayor a 0"],
  },
  anverso: {
    type: String,
    required: [true, "El anverso de la moneda es obligatorio"],
    trim: true,
  },
  reverso: {
    type: String,
    required: [true, "El reverso de la moneda es obligatorio"],
    trim: true,
  },
  canto: {
    type: String,
    default: "",
    trim: true,
  },
  referencias: {
    type: String,
    required: [true, "Las referencias de la moneda son obligatorias"],
    trim: true,
  },
  observaciones: {
    type: String,
    default: "",
    trim: true,
  },
  propietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  coleccion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coleccion",
    default: null,
  },
});

module.exports = mongoose.model("Moneda", MonedaSchema, "Monedas");
