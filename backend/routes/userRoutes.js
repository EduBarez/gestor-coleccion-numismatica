const express = require("express");
const router = express.Router();

// Importar controladores de usuario
const {
  registerUser,
  approveUser,
  rejectUser,
  loginUser,
  getPendingUsers,
} = require("../controllers/userController");

// Rutas para la gestión de usuarios
router.post("/register", registerUser); // Registrar usuario
router.post("/login", loginUser); // Iniciar sesión
router.put("/approve/:id", approveUser); // Aprobar usuario
router.delete("/reject/:id", rejectUser); // Rechazar y eliminar usuario
router.get("/pending", getPendingUsers); // Obtener usuarios pendientes

module.exports = router;
