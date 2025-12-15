// Ejemplo usando un pool SQL genérico (puede ser mssql, mysql2, etc.)
const db = require('../../config/db'); // ajusta ruta/nombre según tu proyecto

class RepositorioOrdenesSql {
  async obtenerPorId(orderId) {
    const query = `
      SELECT id, numeroorden, userid, montototal, estadopago, estadoorden
      FROM orders
      WHERE id = @id
    `;
    const result = await db.query(query, { id: orderId }); // adapta a tu librería SQL
    return result[0] || null;
  }
}

module.exports = RepositorioOrdenesSql;
