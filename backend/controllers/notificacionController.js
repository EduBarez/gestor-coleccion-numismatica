// src/controllers/notificacionController.js
const mongoose = require("mongoose");
const Notificacion = require("../models/notificacion");

/**
 * GET /notifications?userId=...
 * Obtiene todas las notificaciones para un usuario dado (query param: userId).
 */
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

/**
 * POST /notifications
 * Crea una nueva notificación. Se espera en el body:
 * {
 *   userId: "...",
 *   message: "...",
 *   date: "2023-05-01T12:34:56.789Z",
 *   viewed: false
 * }
 */
exports.createNotification = async (req, res) => {
  try {
    // Comprobamos que venga autenticado (se presupone que hay un authMiddleware)
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
      viewed: viewed === true, // si viene distinto de true, queda como false
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

/**
 * PATCH /notifications/:id
 * Marca una notificación concreta como leída (viewed: true).
 */
exports.markAsRead = async (req, res) => {
  try {
    // Se asume que solo usuarios autenticados pueden modificar
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

    // Solo el usuario destinatario debería poder marcarla como leída
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
