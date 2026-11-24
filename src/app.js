const express = require('express');
const { calcularTotal } = require('./pedidos');

const MESAS_POR_HORA = 5;

function createApp() {
  const app = express();
  app.use(express.json());

  const reservas = [];
  const pedidos = [];

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', servicio: 'restaurante-pipeline' });
  });

  // Módulo de reservas
  app.post('/reservas', (req, res) => {
    const { nombre, personas, hora } = req.body;
    if (!nombre || !hora || !Number.isInteger(personas) || personas < 1 || personas > 12) {
      return res.status(400).json({ error: 'Datos de reserva inválidos' });
    }
    const ocupadas = reservas.filter((r) => r.hora === hora).length;
    if (ocupadas >= MESAS_POR_HORA) {
      return res.status(409).json({ error: 'No hay mesas disponibles a esa hora' });
    }
    const reserva = { id: reservas.length + 1, nombre, personas, hora };
    reservas.push(reserva);
    res.status(201).json(reserva);
  });

  app.get('/reservas', (req, res) => res.json(reservas));

  // Módulo de pedidos
  app.post('/pedidos', (req, res) => {
    try {
      const { mesa, items } = req.body;
      if (!mesa) throw new Error('Falta la mesa');
      const total = calcularTotal(items);
      const pedido = { id: pedidos.length + 1, mesa, items, total, estado: 'recibido' };
      pedidos.push(pedido);
      res.status(201).json(pedido);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/pedidos', (req, res) => res.json(pedidos));

  return app;
}

module.exports = { createApp };
