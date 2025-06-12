const mongoose = require("mongoose");
const Coleccion = require("../models/coleccion");
const Moneda = require("../models/moneda");
const Usuario = require("../models/user");

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

exports.getMisColecciones = async (req, res) => {
  try {
    const colecciones = await Coleccion.find({ user: req.user.id }).populate(
      "user",
      "nombre"
    );
    res.status(200).json(colecciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tus colecciones" });
  }
};

exports.getColeccionById = async (req, res) => {
  try {
    const { id } = req.params;

    const coleccion = await Coleccion.findById(id)
      .populate("user", "nombre username")
      .populate("monedas");

    if (!coleccion) {
      return res.status(404).json({ error: "Colección no encontrada" });
    }

    return res.status(200).json({ coleccion });
  } catch (error) {
    console.error("Error en getColeccionById:", error);
    return res.status(500).json({
      error: "Error al obtener la colección",
      details: error.message,
    });
  }
};

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

exports.deleteColeccion = async (req, res) => {
  try {
    const { id } = req.params;

    await Moneda.updateMany({ coleccion: id }, { $set: { coleccion: null } });

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
    const { id } = req.params;
    const { monedas } = req.body;

    if (!Array.isArray(monedas)) {
      return res
        .status(400)
        .json({ error: "Se espera un array de IDs de monedas" });
    }

    const coleccion = await Coleccion.findOne({ _id: id, user: req.user.id });
    if (!coleccion) {
      return res
        .status(404)
        .json({ error: "Colección no encontrada o sin permiso" });
    }

    await Coleccion.updateOne(
      { _id: id, user: req.user.id },
      { $addToSet: { monedas: { $each: monedas } } }
    );

    return res
      .status(200)
      .json({ message: "Monedas agregadas a la colección" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al agregar monedas", details: error.message });
  }
};

exports.quitarMonedasDeColeccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { monedas } = req.body;

    if (!Array.isArray(monedas)) {
      return res
        .status(400)
        .json({ error: "Se espera un array de IDs de monedas" });
    }

    const coleccion = await Coleccion.findOne({ _id: id, user: req.user.id });
    if (!coleccion) {
      return res
        .status(404)
        .json({ error: "Colección no encontrada o sin permiso" });
    }

    await Coleccion.updateOne(
      { _id: id, user: req.user.id },
      { $pull: { monedas: { $in: monedas } } }
    );

    return res
      .status(200)
      .json({ message: "Monedas quitadas de la colección" });
  } catch (error) {
    return res
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
