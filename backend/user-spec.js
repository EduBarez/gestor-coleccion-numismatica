const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server'); // Ajusta si tu server.js está en otro sitio

describe('Pruebas de User Controller', () => {
  let testUserId;
  const testUser = {
    DNI: '12345678Z',
    nombre: 'Test',
    apellidos: 'User',
    email: 'testuser@example.com',
    password: 'Test1234',
    rol: 'user'
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 1. Registro de usuario
  it('Debería registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/api/usuarios/register')
      .send(testUser);
    
    console.log('Registro:', res.status, res.body);
    expect([201, 400]).toContain(res.status); // 400 si ya está registrado
    if (res.status === 201) {
      expect(res.body.message).toBe('Usuario registrado. Pendiente de aprobación.');
    }
  });

  // 2. Obtener el ID del usuario para las siguientes pruebas
  it('Debería obtener el ID del usuario de prueba', async () => {
    const User = require('./models/user');
    const user = await User.findOne({ email: testUser.email });
    expect(user).toBeDefined();
    testUserId = user._id.toString();
  });

  // 3. Aprobar usuario
  it('Debería aprobar al usuario', async () => {
    const res = await request(app)
      .put(`/api/usuarios/approve/${testUserId}`)

    expect([200, 400]).toContain(res.status); // 400 si ya estaba aprobado
    if (res.status === 200) {
      expect(res.body.message).toBe('Usuario aprobado');
    }
  });

  // 4. Login con usuario aprobado
  it('Debería iniciar sesión con usuario aprobado', async () => {
    console.log('Login con:', testUser.email, testUser.password);
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({ email: testUser.email, password: testUser.password });
    console.log('Respuesta login:', res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.nombre).toBe('Test');
  });

  // 5. Rechazar usuario (eliminarlo)
  it('Debería rechazar (eliminar) al usuario', async () => {
    const res = await request(app)
      .delete(`/api/usuarios/reject/${testUserId}`)

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Usuario rechazado y eliminado');
  });
});
