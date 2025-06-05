const mongoose = require("mongoose");
const Notificacion = require("../models/notificacion");

exports.getNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ error: "El formato de userId no es válido" });
    }

    const notificaciones = await Notificacion.find({ userId })
      .sort({ date: -1 })
      .lean();

    return res.status(200).json(notificaciones);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return res.status(500).json({
      error: "Error al obtener notificaciones",
      details: error.message,
    });
  }
};

exports.createNotification = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const { userId, message, date, viewed } = req.body;
    if (!userId || !message || !date) {
      return res.status(400).json({
        error:
          "Faltan campos obligatorios. Se requieren userId, message y date.",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ error: "El userId no tiene formato válido" });
    }

    const nuevaNotificacion = new Notificacion({
      userId,
      message,
      date,
      viewed: viewed === true,
    });

    const guardada = await nuevaNotificacion.save();
    return res.status(201).json(guardada);
  } catch (error) {
    console.error("Error al crear notificación:", error);
    return res.status(500).json({
      error: "Error al crear la notificación",
      details: error.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: "El ID de notificación no es válido" });
    }

    const notificacion = await Notificacion.findById(id);
    if (!notificacion) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    if (!notificacion.userId.equals(req.user.id)) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para modificar esta notificación" });
    }

    notificacion.viewed = true;
    await notificacion.save();

    return res.status(200).json({ message: "Notificación marcada como leída" });
  } catch (error) {
    console.error("Error al marcar como leída:", error);
    return res.status(500).json({
      error: "Error al actualizar la notificación",
      details: error.message,
    });
  }
};
