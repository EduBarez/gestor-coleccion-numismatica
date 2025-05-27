const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./server"); // Ajusta la ruta si 'server.js' está en otro directorio

describe("Pruebas de Moneda Controller", () => {
  let denarioId;
  let adrianoId;
  // Usamos el ObjectId fijo (24 caracteres) para eliminar
  const fixedDeleteId = "67eaae8b12635caec90f9310";

  beforeAll(async () => {
    // Conectar a la base de datos usando el MONGO_URI definido en .env
    const mongoUrl = process.env.MONGO_URI; // "mongodb://127.0.0.1:27017/Colecciones"
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Cerrar la conexión sin borrar la BD
    // (Si quisieras limpiar solo la colección de "Monedas", podrías hacerlo manualmente)
    await mongoose.connection.close();
  });

  // 1. Crear un Denario (createMoneda)
  it("Debería crear un nuevo Denario", async () => {
    const newDenario = {
      fotografia:
        "https://res.cloudinary.com/dqofgewng/image/upload/v1741715219/Julio_Cesar_Elef_cwopwr.jpg",
      nombre: "Denario",
      valor: "1",
      autoridad_emisora: "Julio Cesar",
      ceca: "Galia",
      datacion: "51-49 a.C.",
      estado_conservacion: "EBC",
      metal: "Plata",
      peso: 3.76,
      diametro: 18.2,
      anverso: "Elefante a derecha, pisando un carnyx...",
      reverso: "Instrumentos sacerdotales: símpulo, aspersorio...",
      canto: "",
      referencias: "FFC 50, Cal 640, Craw 443-1, Sear 1399, Co 49",
      observaciones:
        "Con este denario entra Julio César en la historia numismática romana...",
    };

    const res = await request(app).post("/api/monedas").send(newDenario);

    console.log(res.body);
    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    // Usamos .trim() para evitar espacios invisibles
    expect(res.body.nombre.trim()).toBe("Denario");
    denarioId = res.body._id;
  });

  // 2. getMonedas - obtener todas las monedas cuyo nombre sea "Denario"
  it('Debería devolver todas las monedas con nombre "Denario"', async () => {
    const res = await request(app).get("/api/monedas?nombre=Denario");

    expect(res.status).toBe(200);
    const monedas = res.body.monedas;
    expect(Array.isArray(monedas)).toBe(true);
    expect(monedas.length).toBeGreaterThan(0);

    // Comprobar que todas las monedas tengan el nombre "Denario"
    monedas.forEach((coin) => {
      expect(coin.nombre.trim()).toBe("Denario");
    });
  });

  // 3. getMonedaById - obtener el Denario creado usando su ID
  it("Debería obtener el Denario creado por su ID", async () => {
    const res = await request(app).get(`/api/monedas/${denarioId}`);
    expect(res.status).toBe(200);

    // De nuevo, .trim() para prevenir espacios ocultos
    expect(res.body.nombre.trim()).toBe("Denario");
    expect(res.body._id).toBe(denarioId);
  });

  // 4. updateMoneda - actualizar la ceca de la moneda de Adriano a "Roma" (usando un ID fijo existente)
  it('Debería actualizar la ceca de la moneda de Adriano a "Roma"', async () => {
    const adrianoIdFijo = "67e3cf354cc723754393eac1";

    const resUpdate = await request(app)
      .put(`/api/monedas/${adrianoIdFijo}`)
      .send({ ceca: "roma" }); // Enviamos en minúsculas para ver si se normaliza

    expect(resUpdate.status).toBe(200);
    expect(resUpdate.body._id).toBe(adrianoIdFijo);
    expect(resUpdate.body.ceca).toBe("Roma"); // Asumiendo que normalizas a mayúscula inicial
  });

  // 5. deleteMoneda - eliminar una moneda existente con ID fijo
  it.skip("Debería eliminar la moneda con ID fijo 67eaae8b12635caec90f9310", async () => {
    // Paso 1: Eliminar la moneda por su ID
    const resDelete = await request(app).delete(
      `/api/monedas/${fixedDeleteId}`
    );

    expect(resDelete.status).toBe(200);
    expect(resDelete.body.message).toBe("Moneda eliminada correctamente");

    // Paso 2: Confirmar que ya no existe
    const resCheck = await request(app).get(`/api/monedas/${fixedDeleteId}`);

    expect(resCheck.status).toBe(404);
  });
});
