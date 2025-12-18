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
              estado_orden
        FROM orders
        WHERE id = @id
      `);
    return result.recordset[0] || null;
  }
}

module.exports = RepositorioOrdenesSql;


