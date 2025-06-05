const express = require("express");
const router = express.Router();

const {
  getNotifications,
  createNotification,
  markAsRead,
} = require("../controllers/notificacionController");
const { authMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, getNotifications);
router.post("/", authMiddleware, createNotification);
router.patch("/:id", authMiddleware, markAsRead);

module.exports = router;
