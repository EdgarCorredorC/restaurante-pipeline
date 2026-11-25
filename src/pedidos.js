// Lógica de negocio de pedidos
function calcularTotal(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('El pedido debe tener al menos un ítem');
  }
  return items.reduce((total, item) => {
    if (!item.plato || item.cantidad < 1 || item.precio < 0) {
      throw new Error('Ítem inválido');
    }
    return total + item.cantidad * item.precio;
  }, 0);
}

module.exports = { calcularTotal };
