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

// GET /api/pagos/orden/:id  -> Ver estado de pago de una orden
router.get('/orden/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (!orderId) {
      return res.status(400).json({ error: 'id de orden inválido' });
    }

    const orden = await repoOrdenes.obtenerPorId(orderId);
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    return res.json({
      orderId: orden.id,
      numeroOrden: orden.numero_orden,
      estadoPago: orden.estado_pago,
      estadoOrden: orden.estado_orden,
      numeroTransaccion: orden.numero_transaccion
    });
  } catch (err) {
    console.error('Error al consultar estado de pago:', err);
    return res.status(500).json({ error: 'No se pudo consultar el estado de pago' });
  }

});

// POST /api/pagos/yape/confirmacion
// Body: { "orderId": 7, "resultado": "aprobado" | "rechazado" }
router.post('/yape/confirmacion', async (req, res) => {
  try {
    const { orderId, resultado } = req.body;

    if (!orderId || !resultado) {
      return res.status(400).json({ error: 'orderId y resultado son requeridos' });
    }

    const orden = await repoOrdenes.obtenerPorId(orderId);
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    let nuevoEstadoPago;
    let nuevoEstadoTx;

    if (resultado === 'aprobado') {
      nuevoEstadoPago = 'pagada';
      nuevoEstadoTx = 'completada';
    } else if (resultado === 'rechazado') {
      nuevoEstadoPago = 'rechazada';
      nuevoEstadoTx = 'fallida';
    } else {
      return res.status(400).json({ error: 'resultado debe ser "aprobado" o "rechazado"' });
    }

    // Actualizar orden
    await repoOrdenes.actualizarEstadoPago(orderId, nuevoEstadoPago);

    // Actualizar transacción más reciente de esa orden
    await repoTransacciones.actualizarEstadoTransaccionPorOrden(orderId, nuevoEstadoTx);

    return res.status(200).json({
      mensaje: 'Pago actualizado correctamente',
      orderId,
      estadoPago: nuevoEstadoPago,
      estadoTransaccion: nuevoEstadoTx
    });
  } catch (err) {
    console.error('Error al confirmar pago Yape:', err);
    return res.status(500).json({ error: 'No se pudo confirmar el pago con Yape' });
  }
});


module.exports = router;