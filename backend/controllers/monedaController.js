const mongoose = require('mongoose');
const Moneda = require('../models/moneda');
const cloudinary = require('cloudinary').v2;

// Configuración de Cloudinary (se asume que las variables de entorno están definidas)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Función para normalizar cadenas de texto:
 * - Elimina diacríticos (tildes).
 * - Permite modos: 'capitalize' (primera letra de cada palabra en mayúscula),
 *   'upper' (todo en mayúsculas) o 'none' (solo quitar tildes).
 */
function normalizarTexto(texto, modo = 'none') {
  if (!texto || typeof texto !== 'string') return '';
  let textoNormalizado = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  switch (modo) {
    case 'capitalize':
      textoNormalizado = textoNormalizado
        .split(/\s+/)
        .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
        .join(' ');
      break;
    case 'upper':
      textoNormalizado = textoNormalizado.toUpperCase();
      break;
    default:
      break;
  }
  return textoNormalizado;
}

/**
 * Obtener monedas con paginación y filtros de búsqueda.
 * Se pueden buscar por: nombre, autoridad_emisora, ceca, datacion, estado_conservacion y metal.
 */
exports.getMonedas = async (req, res) => {
  try {
    // Construir filtros de búsqueda en función de los query parameters
    const filters = {};
    if (req.query.nombre) {
      filters.nombre = { $regex: normalizarTexto(req.query.nombre, 'capitalize'), $options: 'i' };
    }
    if (req.query.autoridad_emisora) {
      filters.autoridad_emisora = { $regex: normalizarTexto(req.query.autoridad_emisora, 'capitalize'), $options: 'i' };
    }
    if (req.query.ceca) {
      filters.ceca = { $regex: normalizarTexto(req.query.ceca, 'capitalize'), $options: 'i' };
    }
    if (req.query.datacion) {
      // Si 'datacion' es un texto, se puede usar regex. Si es numérico o fecha, se debe adaptar la búsqueda.
      filters.datacion = { $regex: req.query.datacion, $options: 'i' };
    }
    if (req.query.estado_conservacion) {
      filters.estado_conservacion = { $regex: normalizarTexto(req.query.estado_conservacion, 'upper'), $options: 'i' };
    }
    if (req.query.metal) {
      filters.metal = { $regex: normalizarTexto(req.query.metal, 'capitalize'), $options: 'i' };
    }

    // Parámetros de paginación
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);

    const monedas = await Moneda.find(filters)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Moneda.countDocuments(filters);

    res.status(200).json({ total, page, limit, monedas });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las monedas', details: error.message });
  }
};

// Obtener una moneda por ID (sin cambios)
exports.getMonedaById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de moneda no válido' });
    }
    const moneda = await Moneda.findById(id);
    if (!moneda) {
      return res.status(404).json({ error: 'Moneda no encontrada' });
    }
    res.status(200).json(moneda);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la moneda', details: error.message });
  }
};

/**
 * Crear una nueva moneda evitando duplicados.
 * - Si se envía un archivo (req.file) para la fotografía, se sube a Cloudinary.
 */
exports.createMoneda = async (req, res) => {
  try {
    // Si se envía un archivo de imagen (por ejemplo, desde un formulario con Multer), se sube a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'monedas' });
      req.body.fotografia = result.secure_url;
    }

    // Extraer campos específicos del req.body
    let {
      nombre,
      valor,
      autoridad_emisora,
      ceca,
      metal,
      estado_conservacion,
      // Otros campos como: datacion, peso, diametro, anverso, reverso, canto, referencias y observaciones.
    } = req.body;

    // Validaciones mínimas
    if (!nombre || !valor) {
      return res.status(400).json({
        error: 'Se requieren los campos "nombre" y "valor"',
      });
    }

    // Normalización de los campos de texto
    nombre = normalizarTexto(nombre, 'capitalize');
    autoridad_emisora = normalizarTexto(autoridad_emisora, 'capitalize');
    ceca = normalizarTexto(ceca, 'capitalize');
    metal = normalizarTexto(metal, 'capitalize');
    estado_conservacion = normalizarTexto(estado_conservacion, 'upper');

    // Evitar duplicados (se verifica la combinación de nombre y valor)
    const monedaExistente = await Moneda.findOne({ nombre, valor });
    if (monedaExistente) {
      return res.status(400).json({ error: 'Ya existe una moneda con ese nombre y valor' });
    }

    // Crear la nueva moneda usando el spread operator para incluir el resto de los campos
    const moneda = new Moneda({
      ...req.body,
      nombre,
      autoridad_emisora,
      ceca,
      metal,
      estado_conservacion,
    });

    const nuevaMoneda = await moneda.save();
    return res.status(201).json(nuevaMoneda);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la moneda', details: error.message });
  }
};

/**
 * Actualizar una moneda por ID.
 * - Si se envía un nuevo archivo de imagen, se sube a Cloudinary y se actualiza el campo fotografía.
 */
exports.updateMoneda = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de moneda no válido' });
    }

    // Si se envía un nuevo archivo para la fotografía, se sube a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'monedas' });
      req.body.fotografia = result.secure_url;
    }

    // Extraer y normalizar los campos que se envían en el body
    let { nombre, autoridad_emisora, ceca, metal, estado_conservacion } = req.body;
    if (nombre) nombre = normalizarTexto(nombre, 'capitalize');
    if (autoridad_emisora) autoridad_emisora = normalizarTexto(autoridad_emisora, 'capitalize');
    if (ceca) ceca = normalizarTexto(ceca, 'capitalize');
    if (metal) metal = normalizarTexto(metal, 'capitalize');
    if (estado_conservacion) estado_conservacion = normalizarTexto(estado_conservacion, 'upper');

    const monedaActualizada = await Moneda.findByIdAndUpdate(
      id,
      {
        ...req.body,
        nombre,
        autoridad_emisora,
        ceca,
        metal,
        estado_conservacion,
      },
      { new: true }
    );

    if (!monedaActualizada) {
      return res.status(404).json({ error: 'Moneda no encontrada' });
    }
    return res.status(200).json(monedaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la moneda', details: error.message });
  }
};

// Eliminar una moneda por ID (sin cambios)
exports.deleteMoneda = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de moneda no válido' });
    }
    const moneda = await Moneda.findByIdAndDelete(id);
    if (!moneda) {
      return res.status(404).json({ error: 'Moneda no encontrada' });
    }
    res.status(200).json({ message: 'Moneda eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la moneda', details: error.message });
  }
};
