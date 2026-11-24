const { calcularTotal } = require('../src/pedidos');

describe('calcularTotal', () => {
  test('suma cantidad * precio de todos los ítems', () => {
    const items = [
      { plato: 'Bandeja paisa', cantidad: 2, precio: 30000 },
      { plato: 'Limonada', cantidad: 3, precio: 8000 },
    ];
    expect(calcularTotal(items)).toBe(84000);
  });

  test('lanza error si el pedido está vacío', () => {
    expect(() => calcularTotal([])).toThrow('al menos un ítem');
  });

  test('lanza error si un ítem es inválido', () => {
    expect(() => calcularTotal([{ plato: 'Sopa', cantidad: 0, precio: 5000 }])).toThrow('Ítem inválido');
  });
});
