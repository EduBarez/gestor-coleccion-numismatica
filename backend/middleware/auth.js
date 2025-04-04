const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware de autenticación:
 * - Verifica el token JWT enviado en el encabezado Authorization.
 * - Añade el objeto `user` al request con el ID y el rol extraídos del token.
 */
exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o malformado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      rol: decoded.rol
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
