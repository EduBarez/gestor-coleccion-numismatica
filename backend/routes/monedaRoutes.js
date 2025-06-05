const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  getMonedas,
  getMonedaById,
  createMoneda,
  updateMoneda,
  deleteMoneda,
  getMisMonedas,
  getMonedasDeUsuario,
} = require("../controllers/monedaController");

const { authMiddleware } = require("../middleware/auth");

router.get("/", getMonedas);
router.get("/:id", getMonedaById);
router.get("/usuario/mis-monedas", authMiddleware, getMisMonedas);
router.get("/usuario/:userId", getMonedasDeUsuario);
router.post("/", authMiddleware, upload.single("fotografia"), createMoneda);
router.put("/:id", authMiddleware, upload.single("fotografia"), updateMoneda);
router.delete("/:id", authMiddleware, deleteMoneda);

module.exports = router;
