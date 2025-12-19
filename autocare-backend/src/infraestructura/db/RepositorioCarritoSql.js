// src/infraestructura/db/RepositorioCarritoSql.js
const { poolPromise } = require('../../config/db');

class RepositorioCarritoSql {
  async guardarCarrito(userId, items) {
    const pool = await poolPromise;

    // Limpia carrito anterior del usuario
    await pool.request()
      .input('user_id', userId)
      .query(`
        DELETE FROM shopping_cart
        WHERE user_id = @user_id;
      `);

    // Inserta items nuevos
    for (const item of items) {
      await pool.request()
        .input('user_id', userId)
        .input('product_id', item.id)
        .input('cantidad', item.quantity || 1)
        .query(`
          INSERT INTO shopping_cart (
            user_id,
            product_id,
            cantidad,
            agregado_en
          )
          VALUES (
            @user_id,
            @product_id,
            @cantidad,
            GETDATE()
          );
        `);
    }
  }
}

module.exports = RepositorioCarritoSql;
