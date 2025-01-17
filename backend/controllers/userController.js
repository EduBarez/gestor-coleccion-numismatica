const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario con encriptación de contraseña
exports.registerUser = async (req, res) => {
  try {
    const { DNI, nombre, apellidos, email, password } = req.body;

    // Verificar si el email o DNI ya están registrados
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    const existingDNI = await User.findOne({ DNI });
    if (existingDNI) {
      return res.status(400).json({ error: 'El DNI ya está registrado' });
    }

    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

    res.status(200).json({ message: 'Usuario aprobado', user });
  } catch (error) {
    res.status(500).json({ error: 'Error al aprobar el usuario', details: error.message });
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
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Generar un token de autenticación JWT
    const token = jwt.sign({ id: user._id, role: user.role }, 'secreto', { expiresIn: '1h' });

    res.status(200).json({ message: 'Inicio de sesión exitoso', token, user: { id: user._id, nombre: user.nombre, apellidos: user.apellidos, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
  }
};