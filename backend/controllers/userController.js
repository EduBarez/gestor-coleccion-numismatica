const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno

// Expresiones regulares para validaciones
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

// Registrar un nuevo usuario con encriptación de contraseña
exports.registerUser = async (req, res) => {
  try {
    const { DNI, nombre, apellidos, email, password } = req.body;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres, incluir letras y números' });
    }

    // Verificar si el email o DNI ya están registrados
    const existingUser = await User.findOne({ $or: [{ email }, { DNI }] });
    if (existingUser) {
      return res.status(400).json({ error: 'El email o DNI ya están registrados' });
    }

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario con isApproved en false
    const newUser = new User({ DNI, nombre, apellidos, email, password: hashedPassword, isApproved: false });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado. Pendiente de aprobación.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario', details: error.message });
  }
};

// Aprobar un usuario solo si no está aprobado
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (user.isApproved) {
      return res.status(400).json({ error: 'El usuario ya está aprobado' });
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({ message: 'Usuario aprobado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al aprobar el usuario', details: error.message });
  }
};

// Rechazar un usuario eliminándolo de la base de datos
exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Usuario rechazado y eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al rechazar el usuario', details: error.message });
  }
};

// Login de usuario con JWT
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si la cuenta está aprobada
    if (!user.isApproved) {
      return res.status(403).json({ error: 'Cuenta pendiente de aprobación' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar un token de autenticación JWT usando variable de entorno
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: 'Inicio de sesión exitoso', 
      token, 
      user: { id: user._id, nombre: user.nombre, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
  }
};
