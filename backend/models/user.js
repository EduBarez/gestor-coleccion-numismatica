const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  DNI: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  rol: { type: String, enum: ["user", "admin"], default: "user" },
  profilePicture: { type: String, default: "" },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    const userId = doc._id;

    await require("./coleccion").deleteMany({ user: userId });
    await require("./moneda").deleteMany({ propietario: userId });
    await require("./notificacion").deleteMany({ userId: userId });
    await require("./ranking").deleteMany({ idUsuario: userId });
  }
  next();
});

const User = mongoose.model("User", userSchema, "Usuarios");
module.exports = User;
