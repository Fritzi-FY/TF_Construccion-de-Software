// Ejemplo usando un pool SQL genérico (puede ser mssql, mysql2, etc.)
const { poolPromise } = require('../../config/db');

class RepositorioOrdenesSql {
  async obtenerPorId(orderId) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', orderId)
      .query(`
        SELECT id,
              numero_orden,
              user_id,
              monto_total,
              estado_pago,
              estado_orden,
              numero_transaccion
        FROM orders
        WHERE id = @id
      `);
    return result.recordset[0] || null;
  }

  async actualizarPagoPendiente(orderId, numeroTransaccion) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', orderId)
    .input('numero_transaccion', numeroTransaccion)
    .query(`
      UPDATE orders
      SET
        estado_pago = 'pendiente',
        numero_transaccion = @numero_transaccion
      WHERE id = @id
    `);
  }

    async actualizarEstadoPago(orderId, nuevoEstado) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', orderId)
      .input('estado_pago', nuevoEstado)
      .query(`
        UPDATE orders
        SET estado_pago = @estado_pago
        WHERE id = @id
      `);
  }
}

module.exports = RepositorioOrdenesSql;


