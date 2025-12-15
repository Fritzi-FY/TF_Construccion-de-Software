const db = require('../../config/db');

class RepositorioTransaccionesSql {
  async registrarTransaccionPago(pago) {
    const query = `
      INSERT INTO transactionhistory
        (userid, orderid, tipotransaccion, monto, moneda, metodopago, referenciapago, estado, descripcion)
      VALUES
        (@userid, @orderid, 'pago', @monto, @moneda, @metodopago, @referenciapago, @estado, @descripcion)
    `;
    const params = {
      userid: pago.userId,
      orderid: pago.orderId,
      monto: pago.monto,
      moneda: pago.moneda,
      metodopago: pago.metodo,
      referenciapago: pago.referenciaPasarela || '',
      estado: pago.estado,
      descripcion: 'Pago iniciado con Yape vía Izipay'
    };
    const result = await db.query(query, params);
    // adapta según tu driver; aquí asumimos que devuelve insertId
    return { id: result.insertId };
  }
}

module.exports = RepositorioTransaccionesSql;
