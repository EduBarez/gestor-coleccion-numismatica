const Ranking = require("../models/ranking");

exports.addRanking = async (req, res) => {
  try {
    const idUsuario = req.user.id;

    const { puntuacion, aciertos, totalPreguntas, tiempoSegundos, periodo } =
      req.body;

    if (
      typeof puntuacion !== "number" ||
      typeof aciertos !== "number" ||
      typeof totalPreguntas !== "number" ||
      typeof tiempoSegundos !== "number"
    ) {
      return res.status(400).json({ error: "Datos de ranking inválidos" });
    }

    const nuevoRanking = new Ranking({
      idUsuario,
      puntuacion,
      aciertos,
      totalPreguntas,
      tiempoSegundos,
      periodo,
    });

    await nuevoRanking.save();
    res.status(201).json(nuevoRanking);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al guardar el ranking", details: error.message });
  }
};

exports.getTopRanking = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const periodo = req.query.periodo || null;
  const filter = periodo ? { periodo } : {};
  try {
    const top = await Ranking.find(filter)
      .sort({ puntuacion: -1 })
      .limit(limit)
      .populate("idUsuario", "nombre");
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo ranking" });
  }
};
