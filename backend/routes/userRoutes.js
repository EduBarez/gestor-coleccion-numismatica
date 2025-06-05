const express = require("express");
const router = express.Router();

const {
  registerUser,
  approveUser,
  rejectUser,
  loginUser,
  getPendingUsers,
  getUser,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/approve/:id", approveUser);
router.delete("/reject/:id", rejectUser);
router.get("/pending", getPendingUsers);
router.get("/user/:id", getUser);

module.exports = router;
