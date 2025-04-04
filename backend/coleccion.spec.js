const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server');
const jwt = require('jsonwebtoken');

// Simular token de usuario (debes ajustar el ID real de un usuario en tu BD)
const userId = '65fabcde1234567890123456';
const userToken = jwt.sign({ id: userId, rol: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Pruebas de Colección Controller', () => {
  let coleccionId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 1. Crear colección
  it('Debería crear una nueva colección privada', async () => {
    const nueva = {
      nombre: 'Colección Romana',
      descripcion: 'Monedas de época romana',
      publica: false
    };

    const res = await request(app)
      .post('/api/colecciones')
      .set('Authorization', `Bearer ${userToken}`)
      .send(nueva);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.nombre).toBe('Colección Romana');
    coleccionId = res.body._id;
  });

  // 2. Obtener colecciones públicas
  it('Debería obtener colecciones públicas', async () => {
    const res = await request(app).get('/api/colecciones/publicas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 3. Obtener mis colecciones
  it('Debería obtener las colecciones del usuario', async () => {
    const res = await request(app)
      .get('/api/colecciones/usuario')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 4. Obtener una colección por ID
  it('Debería obtener una colección por su ID', async () => {
    const res = await request(app).get(`/api/colecciones/${coleccionId}`);
    expect(res.status).toBe(200);
    expect(res.body.coleccion._id).toBe(coleccionId);
    expect(Array.isArray(res.body.monedas)).toBe(true);
  });

  // 5. Actualizar colección
  it('Debería actualizar el nombre de la colección', async () => {
    const res = await request(app)
      .put(`/api/colecciones/${coleccionId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ nombre: 'Colección Imperial' });

    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Colección Imperial');
  });

  // 6. Eliminar colección (y desvincular monedas)
  it('Debería eliminar la colección y desvincular monedas', async () => {
    const res = await request(app)
      .delete(`/api/colecciones/${coleccionId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Colección eliminada/);
  });
});
