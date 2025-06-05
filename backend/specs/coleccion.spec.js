const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const jwt = require("jsonwebtoken");

const userId = "67f3972e5bf893c6c8087901";
const adminId = "67f3972e5bf893c6c80878ff";

const userToken = jwt.sign(
  { id: userId, rol: "user" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
const adminToken = jwt.sign(
  { id: adminId, rol: "admin" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

describe("Pruebas de Colección Controller (usuario y admin)", () => {
  let coleccionId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("El usuario debería crear una nueva colección privada", async () => {
    const nueva = {
      nombre: "Colección Republicana",
      descripcion: "Monedas de la República Romana",
      publica: false,
    };

    const res = await request(app)
      .post("/api/colecciones")
      .set("Authorization", `Bearer ${userToken}`)
      .send(nueva);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.nombre).toBe("Colección Republicana");
    coleccionId = res.body._id;
  });

  it("Cualquier usuario puede ver las colecciones públicas", async () => {
    const res = await request(app).get("/api/colecciones/publicas");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("El usuario debería ver solo sus colecciones", async () => {
    const res = await request(app)
      .get("/api/colecciones/usuario")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((c) => c.nombre === "Colección Republicana")).toBe(
      true
    );
  });

  it("Debería devolver la colección con sus monedas (vacía)", async () => {
    const res = await request(app).get(`/api/colecciones/${coleccionId}`);
    expect(res.status).toBe(200);
    expect(res.body.coleccion._id).toBe(coleccionId);
    expect(Array.isArray(res.body.monedas)).toBe(true);
  });

  it("El usuario puede actualizar su colección", async () => {
    const res = await request(app)
      .put(`/api/colecciones/${coleccionId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ nombre: "Colección de Roma" });

    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe("Colección de Roma");
  });

  it("El admin puede acceder a todas las colecciones (ruta admin)", async () => {
    const res = await request(app)
      .get("/api/colecciones/admin/todas")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const nombres = res.body.map((c) => c.nombre);
    expect(nombres).toContain("Colección de Roma");
  });

  it("El admin también puede eliminar la colección", async () => {
    const res = await request(app)
      .delete(`/api/colecciones/${coleccionId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Colección eliminada/);
  });
});
