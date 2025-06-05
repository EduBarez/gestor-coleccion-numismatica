const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./server");

describe("Pruebas de Moneda Controller", () => {
  let denarioId;
  let adrianoId;
  const fixedDeleteId = "67eaae8b12635caec90f9310";

  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URI;
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

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
    expect(res.body.nombre.trim()).toBe("Denario");
    denarioId = res.body._id;
  });

  it('Debería devolver todas las monedas con nombre "Denario"', async () => {
    const res = await request(app).get("/api/monedas?nombre=Denario");

    expect(res.status).toBe(200);
    const monedas = res.body.monedas;
    expect(Array.isArray(monedas)).toBe(true);
    expect(monedas.length).toBeGreaterThan(0);

    monedas.forEach((coin) => {
      expect(coin.nombre.trim()).toBe("Denario");
    });
  });

  it("Debería obtener el Denario creado por su ID", async () => {
    const res = await request(app).get(`/api/monedas/${denarioId}`);
    expect(res.status).toBe(200);

    expect(res.body.nombre.trim()).toBe("Denario");
    expect(res.body._id).toBe(denarioId);
  });

  it('Debería actualizar la ceca de la moneda de Adriano a "Roma"', async () => {
    const adrianoIdFijo = "67e3cf354cc723754393eac1";

    const resUpdate = await request(app)
      .put(`/api/monedas/${adrianoIdFijo}`)
      .send({ ceca: "roma" });

    expect(resUpdate.status).toBe(200);
    expect(resUpdate.body._id).toBe(adrianoIdFijo);
    expect(resUpdate.body.ceca).toBe("Roma");
  });

  it.skip("Debería eliminar la moneda con ID fijo 67eaae8b12635caec90f9310", async () => {
    const resDelete = await request(app).delete(
      `/api/monedas/${fixedDeleteId}`
    );

    expect(resDelete.status).toBe(200);
    expect(resDelete.body.message).toBe("Moneda eliminada correctamente");

    const resCheck = await request(app).get(`/api/monedas/${fixedDeleteId}`);

    expect(resCheck.status).toBe(404);
  });
});
