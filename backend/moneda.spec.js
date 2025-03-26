const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server'); // Ajusta la ruta si 'server.js' está en otro directorio

describe('Pruebas de Moneda Controller', () => {
  let denarioId;
  let adrianoId;
  // Usamos el ObjectId fijo (24 caracteres) para eliminar
  const fixedDeleteId = '67e3cf354cc723754393eabe';

  beforeAll(async () => {
    // Conectar a la base de datos usando el MONGO_URI definido en .env
    const mongoUrl = process.env.MONGO_URI; // "mongodb://127.0.0.1:27017/Colecciones"
    await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // Cerrar la conexión sin borrar la BD
    // (Si quisieras limpiar solo la colección de "Monedas", podrías hacerlo manualmente)
    await mongoose.connection.close();
  });

  // 1. Crear un Denario (createMoneda)
  it('Debería crear un nuevo Denario', async () => {
    const newDenario = {
      fotografia: 'https://res.cloudinary.com/dqofgewng/image/upload/v1741715219/Julio_Cesar_Elef_cwopwr.jpg',
      nombre: 'Denario',
      valor: '1',
      autoridad_emisora: 'Julio Cesar',
      ceca: 'Galia',
      datacion: '51-49 a.C.',
      estado_conservacion: 'EBC',
      metal: 'Plata',
      peso: 3.76,
      diametro: 18.2,
      anverso: 'Elefante a derecha, pisando un carnyx...',
      reverso: 'Instrumentos sacerdotales: símpulo, aspersorio...',
      canto: '',
      referencias: 'FFC 50, Cal 640, Craw 443-1, Sear 1399, Co 49',
      observaciones: 'Con este denario entra Julio César en la historia numismática romana...',
      trivia: null
    };

    const res = await request(app)
      .post('/api/monedas')
      .send(newDenario);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    // Usamos .trim() para evitar espacios invisibles
    expect(res.body.nombre.trim()).toBe('Denario');
    denarioId = res.body._id;
  });

  // 2. getMonedas - obtener todas las monedas cuyo nombre sea "Denario"
  it('Debería devolver todas las monedas con nombre "Denario"', async () => {
    const res = await request(app)
      .get('/api/monedas?nombre=Denario');

    expect(res.status).toBe(200);
    const monedas = res.body.monedas;
    expect(Array.isArray(monedas)).toBe(true);
    expect(monedas.length).toBeGreaterThan(0);

    // Comprobar que todas las monedas tengan el nombre "Denario"
    monedas.forEach((coin) => {
      expect(coin.nombre.trim()).toBe('Denario');
    });
  });

  // 3. getMonedaById - obtener el Denario creado usando su ID
  it('Debería obtener el Denario creado por su ID', async () => {
    const res = await request(app)
      .get(`/api/monedas/${denarioId}`);
    expect(res.status).toBe(200);

    // De nuevo, .trim() para prevenir espacios ocultos
    expect(res.body.nombre.trim()).toBe('Denario');
    expect(res.body._id).toBe(denarioId);
  });

  // 4. updateMoneda - actualizar la ceca de la moneda de Adriano a "Roma"
  it('Debería actualizar la ceca de la moneda de "Adriano" a "Roma"', async () => {
    // Buscar la moneda de Adriano (filtrando por nombre "Denario" y autoridad "Adriano")
    let adrianoCoin;
    const resBuscar = await request(app)
      .get('/api/monedas?nombre=Denario&autoridad_emisora=Adriano');
    
    if (resBuscar.status === 200 && resBuscar.body.monedas.length > 0) {
      adrianoCoin = resBuscar.body.monedas[0];
    } else {
      // Si no existe, crearla
      const newAdriano = {
        fotografia: 'https://res.cloudinary.com/dqofgewng/image/upload/v1741715219/813_Adri.jpg',
        nombre: 'Denario',
        valor: '1',
        autoridad_emisora: 'Adriano',
        ceca: 'Original', // valor inicial
        datacion: '137 d.C.',
        estado_conservacion: 'MBC',
        metal: 'Plata',
        peso: 3.4,
        diametro: 19,
        anverso: 'HADRIANVS AVG COS III P P. Cabeza descubierta de Adriano...',
        reverso: 'SALVS AVG. Salus sentada a derecha...',
        canto: '',
        referencias: 'RSC 98, RIC 240, BMC 576',
        observaciones: 'Ejemplo de denario de Adriano',
        trivia: null
      };
      const resCreateAdriano = await request(app)
        .post('/api/monedas')
        .send(newAdriano);

      expect(resCreateAdriano.status).toBe(201);
      adrianoCoin = resCreateAdriano.body;
    }
    adrianoId = adrianoCoin._id;

    // Actualizar la ceca a "roma" (se espera que se normalice a "Roma")
    const resUpdate = await request(app)
      .put(`/api/monedas/${adrianoId}`)
      .send({ ceca: 'roma' });
    
    expect(resUpdate.status).toBe(200);
    expect(resUpdate.body.ceca).toBe('Roma');
  });

  // 5. deleteMoneda - eliminar la moneda con el ID fijo ya existente
  it('Debería eliminar la moneda con ID 67e3cf354cc723754393eabe', async () => {
    // Primero, crear (o asegurar) la existencia de la moneda con ese _id
    const coinToDelete = {
      _id: fixedDeleteId,
      fotografia: 'https://res.cloudinary.com/dqofgewng/image/upload/v1741715219/ejemplo.jpg',
      nombre: 'MonedaDelete',
      valor: '2',
      autoridad_emisora: 'Test',
      ceca: 'Test',
      datacion: '100 d.C.',
      estado_conservacion: 'EBC',
      metal: 'Oro',
      peso: 5.0,
      diametro: 20,
      anverso: 'Anverso de prueba',
      reverso: 'Reverso de prueba',
      canto: '',
      referencias: 'Referencia de prueba',
      observaciones: 'Observaciones de prueba',
      trivia: null
    };

    // Crear la moneda con ese _id (si no existe)
    const resCreateDelete = await request(app)
      .post('/api/monedas')
      .send(coinToDelete);
    // Puede fallar con 400 si ya existe.  
    // En ese caso, omitimos el error a menos que sea otro status
    if (resCreateDelete.status !== 201 && resCreateDelete.status !== 400) {
      throw new Error(`Fallo al crear la moneda con ID fijo. Status: ${resCreateDelete.status}`);
    }

    // Eliminar la moneda con el _id fijo
    const resDelete = await request(app)
      .delete(`/api/monedas/${fixedDeleteId}`);
    expect(resDelete.status).toBe(200);
    expect(resDelete.body.message).toBe('Moneda eliminada correctamente');
  });
});
