const express = require("express");
const router = express.Router();
const {
  addRanking,
  getTopRanking,
} = require("../controllers/rankingController");
const { authMiddleware } = require("../middleware/auth");

router.post("/", authMiddleware, addRanking);
router.get("/top/:limit?", getTopRanking);

module.exports = router;
