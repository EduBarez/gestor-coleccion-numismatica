const express = require("express");
const router = express.Router();
const {
  createColeccion,
  getColeccionesPublicas,
  getMisColecciones,
  getColeccionById,
  updateColeccion,
  deleteColeccion,
  getTodasLasColecciones,
  agregarMonedasAColeccion,
  quitarMonedasDeColeccion,
} = require("../controllers/coleccionController");
const { authMiddleware } = require("../middleware/auth");

router.post("/", authMiddleware, createColeccion);
router.get("/publicas", getColeccionesPublicas);
router.get("/usuario/mis-colecciones", authMiddleware, getMisColecciones);
router.get("/admin/todas", authMiddleware, getTodasLasColecciones);
router.get("/:id", getColeccionById);
router.put("/:id", authMiddleware, updateColeccion);
router.put("/:id/agregar-monedas", authMiddleware, agregarMonedasAColeccion);
router.put("/:id/quitar-monedas", authMiddleware, quitarMonedasDeColeccion);
router.delete("/:id", authMiddleware, deleteColeccion);

module.exports = router;
