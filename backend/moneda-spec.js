const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Asegúrate de que este es el archivo correcto donde se ejecuta tu servidor
const Moneda = require('../models/moneda');

describe('Pruebas para el controlador de Monedas', () => {
  
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let monedaId;

  test('Debe crear una nueva moneda', async () => {
    const nuevaMoneda = {
      nombre: 'Denario',
      valor: 1,
      autoridad_emisora: 'Nerón',
      ceca: 'Roma',
      datacion: '65 dC',
      estado_conservacion: 'MBC+',
      metal: 'Plata',
      peso: 3.32,
      diametro: 17,
      anverso: 'NERO CAESAR AVGVSTVS. Cabeza laureada de Nerón a derecha.',
      reverso: 'VESTA. El Templo de Vesta abovedado de seis columnas (hexástilo).',
      canto: '',
      referencias: 'RIC I p. 153, 62. Sear 946. Cohen 335',
      observaciones: 'Nerón comisionó la reconstrucción del templo de Vesta.',
      fotografia: 'url_de_imagen.jpg',
    };

    const res = await request(app).post('/api/monedas').send(nuevaMoneda);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    monedaId = res.body._id;
  });

  test('Debe obtener todas las monedas', async () => {
    const res = await request(app).get('/api/monedas');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.monedas)).toBe(true);
  });

  test('Debe obtener una moneda por ID', async () => {
    const res = await request(app).get(`/api/monedas/${monedaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', monedaId);
  });

  test('Debe actualizar una moneda', async () => {
    const res = await request(app)
      .put(`/api/monedas/${monedaId}`)
      .send({ nombre: 'Denario Modificado' });
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Denario Modificado');
  });

  test('Debe eliminar una moneda', async () => {
    const res = await request(app).delete(`/api/monedas/${monedaId}`);
    expect(res.statusCode).toBe(200);
  });

});
