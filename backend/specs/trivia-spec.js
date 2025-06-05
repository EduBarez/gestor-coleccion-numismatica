const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

describe("Pruebas de Trivia Controller", () => {
  let preguntaId;

  const sampleTrivia = {
    pregunta:
      "¿Qué civilización fue derrotada por Julio César en la Guerra de las Galias?",
    opciones: ["Griegos", "Cartagineses", "Galos", "Germanos"],
    respuestaCorrecta: "Galos",
    periodo: "Roma antigua",
  };

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

  it("Debería crear una nueva pregunta de trivia", async () => {
    const res = await request(app).post("/api/trivia").send(sampleTrivia);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.pregunta).toBe(sampleTrivia.pregunta);
    preguntaId = res.body._id;
  });

  it("Debería obtener todas las preguntas de trivia", async () => {
    const res = await request(app).get("/api/trivia");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Debería obtener la pregunta de trivia por su ID", async () => {
    const res = await request(app).get(`/api/trivia/${preguntaId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(preguntaId);
    expect(res.body.pregunta).toBe(sampleTrivia.pregunta);
  });

  it('Debería obtener preguntas por el periodo "Roma antigua"', async () => {
    const res = await request(app).get("/api/trivia/periodo/Roma%20antigua");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((p) => {
      expect(p.periodo).toBe("Roma antigua");
    });
  });

  it("Debería actualizar la pregunta de trivia", async () => {
    const res = await request(app).put(`/api/trivia/${preguntaId}`).send({
      pregunta: "¿Qué pueblo fue conquistado por Julio César en la Galia?",
    });

    expect(res.status).toBe(200);
    expect(res.body.pregunta).toBe(
      "¿Qué pueblo fue conquistado por Julio César en la Galia?"
    );
  });

  it.skip("Debería eliminar la pregunta de trivia", async () => {
    const res = await request(app).delete(`/api/trivia/${preguntaId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Pregunta eliminada correctamente");
  });

  it.skip("No debería encontrar la pregunta eliminada", async () => {
    const res = await request(app).get(`/api/trivia/${preguntaId}`);
    expect(res.status).toBe(404);
  });
});
