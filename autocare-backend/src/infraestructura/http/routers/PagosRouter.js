const express = require('express');
const RepositorioOrdenesSql = require('../../db/RepositorioOrdenesSql');
const RepositorioTransaccionesSql = require('../../db/RepositorioTransaccionesSql');
const IzipayAdapter = require('../../pagos/IzipayAdapter');
const IniciarPagoYapeIzipay = require('../../../casos-de-uso/pagos/IniciarPagoYapeIzipay');

const router = express.Router();

// Instancias de infraestructura (en un proyecto grande podrías inyectarlas desde otro lado)
const repoOrdenes = new RepositorioOrdenesSql();
const repoTransacciones = new RepositorioTransaccionesSql();
const servicioPasarela = new IzipayAdapter({
  merchantCode: process.env.IZIPAY_MERCHANT_CODE,
  environment: process.env.IZIPAY_ENV || 'sandbox'
});
const iniciarPagoYapeUC = new IniciarPagoYapeIzipay({
  repoOrdenes,
  repoTransacciones,
  servicioPasarela
});

// POST /api/pagos/yape
router.post('/yape', async (req, res) => {
  try {
    const { orderId, userId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'orderId es requerido' });
    }

    const resultado = await iniciarPagoYapeUC.ejecutar({ orderId, userId });
    return res.status(200).json(resultado);
  } catch (err) {
    console.error('Error al iniciar pago Yape:', err);
    return res.status(500).json({ error: 'No se pudo iniciar el pago con Yape' });
  }
});

module.exports = router;
