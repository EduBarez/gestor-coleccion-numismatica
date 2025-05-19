const mongoose = require("mongoose");
const Coleccion = require("../models/coleccion");
const Moneda = require("../models/moneda");
const Usuario = require("../models/user");

// Crear colección
exports.createColeccion = async (req, res) => {
  try {
    const { nombre, descripcion, publica } = req.body;
    const user = req.user.id;

    const coleccion = new Coleccion({ nombre, descripcion, publica, user });
    const guardada = await coleccion.save();
    res.status(201).json(guardada);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear la colección", details: error.message });
  }
};

// Obtener colecciones públicas
exports.getColeccionesPublicas = async (req, res) => {
  try {
    const colecciones = await Coleccion.find({ publica: true }).populate(
      "user"
    );
    res.status(200).json(colecciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener colecciones públicas" });
  }
};

// Colecciones del user autenticado
exports.getMisColecciones = async (req, res) => {
  try {
    const colecciones = await Coleccion.find({ user: req.user.id });
    res.status(200).json(colecciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tus colecciones" });
  }
};

// Obtener una colección y sus monedas
exports.getColeccionById = async (req, res) => {
  try {
    const coleccion = await Coleccion.findById(req.params.id).populate("user");
    if (!coleccion)
      return res.status(404).json({ error: "Colección no encontrada" });

    const monedas = await Moneda.find({ coleccion: coleccion._id });

    res.status(200).json({ coleccion, monedas });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la colección" });
  }
};

// Actualizar una colección
exports.updateColeccion = async (req, res) => {
  try {
    const coleccion = await Coleccion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!coleccion)
      return res.status(404).json({ error: "Colección no encontrada" });
    res.status(200).json(coleccion);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la colección" });
  }
};

// Eliminar una colección y desvincular sus monedas
exports.deleteColeccion = async (req, res) => {
  try {
    const { id } = req.params;

    // Desvincular monedas
    await Moneda.updateMany({ coleccion: id }, { $set: { coleccion: null } });

    // Eliminar colección
    const resultado = await Coleccion.findByIdAndDelete(id);
    if (!resultado)
      return res.status(404).json({ error: "Colección no encontrada" });

    res
      .status(200)
      .json({ message: "Colección eliminada y monedas desvinculadas" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la colección" });
  }
};

exports.agregarMonedasAColeccion = async (req, res) => {
  try {
    const { id } = req.params; // ID de la colección
    const { monedas } = req.body; // array de IDs de monedas

    // Validación básica
    if (!Array.isArray(monedas)) {
      return res
        .status(400)
        .json({ error: "Se espera un array de IDs de monedas" });
    }

    // Actualizar todas las monedas
    await Moneda.updateMany(
      { _id: { $in: monedas }, propietario: req.user.id },
      { $set: { coleccion: id } }
    );

    res.status(200).json({ message: "Monedas agregadas a la colección" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al agregar monedas", details: error.message });
  }
};

exports.quitarMonedasDeColeccion = async (req, res) => {
  try {
    const { id } = req.params; // ID de la colección
    const { monedas } = req.body; // array de IDs

    if (!Array.isArray(monedas)) {
      return res
        .status(400)
        .json({ error: "Se espera un array de IDs de monedas" });
    }

    await Moneda.updateMany(
      { _id: { $in: monedas }, propietario: req.user.id, coleccion: id },
      { $set: { coleccion: null } }
    );

    res.status(200).json({ message: "Monedas quitadas de la colección" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al quitar monedas", details: error.message });
  }
};

exports.getTodasLasColecciones = async (req, res) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ error: "Acceso solo para administradores" });
  }

  try {
    const colecciones = await Coleccion.find().populate("user");
    res.status(200).json(colecciones);
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener todas las colecciones",
      details: err.message,
    });
  }
};
