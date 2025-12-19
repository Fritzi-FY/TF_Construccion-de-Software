const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../../config/db');

/**
 * POST /api/ordenes
 */
router.post('/ordenes', async (req, res) => {
  const {
    userId,
    addressId,
    subtotal,
    igv,
    envio,
    total,
    promoCode,
    metodoPago
  } = req.body;

  if (!userId || !addressId) {
    return res.status(400).json({ error: 'userId y addressId son requeridos' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('user_id', userId)
      .input('direccion_envio_id', addressId)
      .input('monto_subtotal', subtotal)
      .input('impuesto', igv)
      .input('monto_total', total)
      .input('descuento', 0)
      .input('codigo_descuento', promoCode || null)
      .input('metodo_pago', metodoPago || 'efectivo')
      .query(`
        INSERT INTO orders (
          numero_orden,
          user_id,
          estado_orden,
          monto_total,
          monto_subtotal,
          impuesto,
          descuento,
          codigo_descuento,
          direccion_envio_id,
          metodo_pago,
          estado_pago,
          created_at
        )
        OUTPUT INSERTED.id
        VALUES (
          CONCAT('ORD-', FORMAT(GETDATE(), 'yyyyMMddHHmmss')),
          @user_id,
          'pendiente',
          @monto_total,
          @monto_subtotal,
          @impuesto,
          @descuento,
          @codigo_descuento,
          @direccion_envio_id,
          @metodo_pago,
          'pendiente',
          GETDATE()
        );
      `);

    const orderId = result.recordset[0].id;
    return res.json({ orderId });
  } catch (err) {
    console.error('Error en /api/ordenes:', err);
    return res.status(500).json({ error: 'No se pudo crear la orden' });
  }
});

module.exports = router;
