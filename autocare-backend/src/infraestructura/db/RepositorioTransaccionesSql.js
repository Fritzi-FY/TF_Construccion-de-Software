const { poolPromise } = require('../../config/db');

class RepositorioTransaccionesSql {
  async registrarTransaccionPago(pago) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('user_id', pago.userId)
      .input('order_id', pago.orderId)
      .input('monto', pago.monto)
      .input('moneda', pago.moneda)
      .input('metodo_pago', pago.metodo)
      .input('referencia_pago', pago.referenciaPasarela || '')
      .input('estado', pago.estado)
      .input('descripcion', 'Pago iniciado con Yape vía Izipay')
      .query(`
        INSERT INTO transaction_history
          (user_id, order_id, tipo_transaccion, monto, moneda,
           metodo_pago, referencia_pago, estado, descripcion)
        OUTPUT INSERTED.id
        VALUES
          (@user_id, @order_id, 'pago', @monto, @moneda,
           @metodo_pago, @referencia_pago, @estado, @descripcion)
      `);

    return { id: result.recordset[0].id };
  }

  async actualizarEstadoTransaccionPorOrden(orderId, nuevoEstado) {
  const pool = await poolPromise;
  await pool.request()
    .input('order_id', orderId)
    .input('estado', nuevoEstado)
    .query(`
      UPDATE transaction_history
      SET estado = @estado
      WHERE id = (
        SELECT TOP 1 id
        FROM transaction_history
        WHERE order_id = @order_id
        ORDER BY created_at DESC
      )
    `);
  }
}

module.exports = RepositorioTransaccionesSql;


