const mongoose = require("mongoose");
const Moneda = require("../models/moneda");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function normalizarTexto(texto, modo = "none") {
  if (!texto || typeof texto !== "string") return "";
  let textoNormalizado = texto.trim();

  const romanoValido =
    /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;

  switch (modo) {
    case "capitalize":
      textoNormalizado = textoNormalizado
        .split(/\s+/)
        .map((palabra) => {
          const match = palabra.match(
            /^([^A-Za-zÀ-ÿ]*)([A-Za-zÀ-ÿ]+)([^A-Za-zÀ-ÿ]*)$/u
          );
          if (!match) return palabra;

          const [, prefijo, nucleo, sufijo] = match;

          if (romanoValido.test(nucleo)) {
            const rom = nucleo.toLocaleUpperCase("es");
            return prefijo + rom + sufijo;
          }

          const primera = nucleo.charAt(0).toLocaleUpperCase("es");
          const resto = nucleo.slice(1).toLocaleLowerCase("es");
          return prefijo + primera + resto + sufijo;
        })
        .join(" ");
      break;

    case "upper":
      textoNormalizado = textoNormalizado.toLocaleUpperCase("es");
      break;

    default:
      break;
  }

  return textoNormalizado;
}

exports.getMonedas = async (req, res) => {
  try {
    const filters = {};
    if (req.query.nombre) {
      filters.nombre = {
        $regex: normalizarTexto(req.query.nombre, "capitalize"),
        $options: "i",
      };
    }
    if (req.query.autoridad_emisora) {
      filters.autoridad_emisora = {
        $regex: normalizarTexto(req.query.autoridad_emisora, "capitalize"),
        $options: "i",
      };
    }
    if (req.query.ceca) {
      filters.ceca = {
        $regex: normalizarTexto(req.query.ceca, "capitalize"),
        $options: "i",
      };
    }
    if (req.query.datacion) {
      filters.datacion = { $regex: req.query.datacion, $options: "i" };
    }
    if (req.query.estado_conservacion) {
      filters.estado_conservacion = {
        $regex: normalizarTexto(req.query.estado_conservacion, "upper"),
        $options: "i",
      };
    }
    if (req.query.metal) {
      filters.metal = {
        $regex: normalizarTexto(req.query.metal, "capitalize"),
        $options: "i",
      };
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);

    const monedas = await Moneda.find(filters)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Moneda.countDocuments(filters);

    res.status(200).json({ total, page, limit, monedas });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener las monedas", details: error.message });
  }
};

exports.getMonedaById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de moneda no válido" });
    }
    const moneda = await Moneda.findById(id);
    if (!moneda) {
      return res.status(404).json({ error: "Moneda no encontrada" });
    }
    res.status(200).json(moneda);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener la moneda", details: error.message });
  }
};

exports.createMoneda = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "monedas",
      });
      req.body.fotografia = result.secure_url;
    }

    let { nombre, valor, autoridad_emisora, ceca, metal, estado_conservacion } =
      req.body;

    if (!nombre || !valor) {
      return res
        .status(400)
        .json({ error: 'Se requieren los campos "nombre" y "valor"' });
    }

    nombre = normalizarTexto(nombre, "capitalize");
    autoridad_emisora = normalizarTexto(autoridad_emisora, "capitalize");
    ceca = normalizarTexto(ceca, "capitalize");
    metal = normalizarTexto(metal, "capitalize");
    estado_conservacion = normalizarTexto(estado_conservacion, "upper");

    const moneda = new Moneda({
      ...req.body,
      nombre,
      autoridad_emisora,
      ceca,
      metal,
      estado_conservacion,
      propietario: req.user.id,
    });

    const nuevaMoneda = await moneda.save();
    return res.status(201).json(nuevaMoneda);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear la moneda", details: error.message });
  }
};

exports.updateMoneda = async (req, res) => {
  try {
    const { id } = req.params;
    const moneda = await Moneda.findById(id);
    if (!moneda) {
      return res.status(404).json({ error: "Moneda no encontrada" });
    }

    if (req.file) {
      const urlVieja = moneda.fotografia;
      const match = urlVieja.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
      if (match && match[1]) {
        await cloudinary.uploader.destroy(match[1]);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "monedas",
      });
      req.body.fotografia = result.secure_url;
    }

    if (req.body.nombre) {
      req.body.nombre = normalizarTexto(req.body.nombre, "capitalize");
    }
    if (req.body.autoridad_emisora) {
      req.body.autoridad_emisora = normalizarTexto(
        req.body.autoridad_emisora,
        "capitalize"
      );
    }
    if (req.body.ceca) {
      req.body.ceca = normalizarTexto(req.body.ceca, "capitalize");
    }
    if (req.body.metal) {
      req.body.metal = normalizarTexto(req.body.metal, "capitalize");
    }
    if (req.body.estado_conservacion) {
      req.body.estado_conservacion = normalizarTexto(
        req.body.estado_conservacion,
        "upper"
      );
    }

    const monedaActualizada = await Moneda.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(monedaActualizada);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error al actualizar la moneda", details: error.message });
  }
};

exports.deleteMoneda = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de moneda no válido" });
    }

    const moneda = await Moneda.findById(id);
    if (!moneda) {
      return res.status(404).json({ error: "Moneda no encontrada" });
    }

    if (
      moneda.propietario.toString() !== req.user.id &&
      req.user.rol !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para eliminar esta moneda" });
    }

    if (moneda.fotografia) {
      const match = moneda.fotografia.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
      if (match && match[1]) {
        await cloudinary.uploader.destroy(match[1]);
      }
    }

    await Moneda.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Moneda y fotografía eliminadas correctamente" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error al eliminar la moneda", details: error.message });
  }
};

exports.getMisMonedas = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const monedas = await Moneda.find({ propietario: usuarioId });

    res.status(200).json(monedas);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener tus monedas", details: error.message });
  }
};

exports.getMonedasDeUsuario = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID de usuario no válido" });
    }

    const monedas = await Moneda.find({ propietario: userId });

    res.status(200).json(monedas);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener monedas del usuario",
      details: error.message,
    });
  }
};
