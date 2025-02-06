const mongoose = require('mongoose');
const Moneda = require('../models/moneda');

// Obtener todas las monedas con paginación
exports.getMonedas = async (req, res) => {
  try {
    // Parseamos y validamos los parámetros de paginación para que sean números enteros positivos
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);

    const monedas = await Moneda.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Moneda.countDocuments();

    res.status(200).json({
      total,
      page,
      limit,
      monedas
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las monedas', details: error.message });
  }
};

// Obtener una moneda por ID
exports.getMonedaById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de moneda no válido' });
    }
    
    const moneda = await Moneda.findById(id);
    if (!moneda) return res.status(404).json({ error: 'Moneda no encontrada' });

    res.status(200).json(moneda);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la moneda', details: error.message });
  }
};

// Crear una nueva moneda evitando duplicados
exports.createMoneda = async (req, res) => {
  try {
    const { nombre, valor } = req.body;
    
    // Validación opcional: verificar que se reciban los campos necesarios.
    if (!nombre || !valor) {
      return res.status(400).json({ error: 'Se requieren los campos "nombre" y "valor"' });
    }

    const monedaExistente = await Moneda.findOne({ nombre, valor });
    if (monedaExistente) {
      return res.status(400).json({ error: 'Ya existe una moneda con ese nombre y valor' });
    }

    const moneda = new Moneda(req.body);
    const nuevaMoneda = await moneda.save();
    res.status(201).json(nuevaMoneda);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la moneda', details: error.message });
  }
};

// Actualizar una moneda por ID
exports.updateMoneda = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de moneda no válido' });
    }
    
    const moneda = await Moneda.findByIdAndUpdate(id, req.body, { new: true });
    if (!moneda) return res.status(404).json({ error: 'Moneda no encontrada' });

    res.status(200).json(moneda);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la moneda', details: error.message });
  }
};

// Eliminar una moneda por ID
exports.deleteMoneda = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de moneda no válido' });
    }
    
    const moneda = await Moneda.findByIdAndDelete(id);
    if (!moneda) return res.status(404).json({ error: 'Moneda no encontrada' });

    res.status(200).json({ message: 'Moneda eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la moneda', details: error.message });
  }
};