const Moneda = require('../models/moneda');

// Obtener todas las monedas
exports.getMonedas = async (req, res) => {
  try {
    const monedas = await Moneda.find();
    res.status(200).json(monedas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las monedas', details: error.message });
  }
};

// Obtener una moneda por ID
exports.getMonedaById = async (req, res) => {
  try {
    const { id } = req.params;
    const moneda = await Moneda.findById(id);
    if (!moneda) return res.status(404).json({ error: 'Moneda no encontrada' });
    res.status(200).json(moneda);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la moneda', details: error.message });
  }
};

// Crear una nueva moneda
exports.createMoneda = async (req, res) => {
  try {
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
    const moneda = await Moneda.findByIdAndDelete(id);
    if (!moneda) return res.status(404).json({ error: 'Moneda no encontrada' });
    res.status(200).json({ message: 'Moneda eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la moneda', details: error.message });
  }
};
