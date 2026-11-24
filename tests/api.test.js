const request = require('supertest');
const { createApp } = require('../src/app');

describe('API del restaurante', () => {
  test('GET /health responde ok', async () => {
    const res = await request(createApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('POST /reservas crea una reserva válida', async () => {
    const res = await request(createApp())
      .post('/reservas')
      .send({ nombre: 'Ana', personas: 4, hora: '19:00' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(1);
  });

  test('POST /reservas rechaza datos inválidos', async () => {
    const res = await request(createApp()).post('/reservas').send({ nombre: 'Ana', personas: 0 });
    expect(res.status).toBe(400);
  });

  test('POST /reservas responde 409 cuando no hay mesas', async () => {
    const app = createApp();
    for (let i = 0; i < 5; i++) {
      await request(app).post('/reservas').send({ nombre: `Cliente ${i}`, personas: 2, hora: '20:00' });
    }
    const res = await request(app).post('/reservas').send({ nombre: 'Extra', personas: 2, hora: '20:00' });
    expect(res.status).toBe(409);
  });

  test('POST /pedidos calcula el total', async () => {
    const res = await request(createApp())
      .post('/pedidos')
      .send({ mesa: 3, items: [{ plato: 'Ajiaco', cantidad: 2, precio: 25000 }] });
    expect(res.status).toBe(201);
    expect(res.body.total).toBe(50000);
  });

  test('POST /pedidos rechaza pedidos vacíos', async () => {
    const res = await request(createApp()).post('/pedidos').send({ mesa: 3, items: [] });
    expect(res.status).toBe(400);
  });
});
