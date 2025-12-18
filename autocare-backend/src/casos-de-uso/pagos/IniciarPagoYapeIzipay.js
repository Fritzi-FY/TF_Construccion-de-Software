const Pago = require('../../dominio/entidades/Pago');

class IniciarPagoYapeIzipay {
  constructor({ repoOrdenes, repoTransacciones, servicioPasarela }) {
    this.repoOrdenes = repoOrdenes;
    this.repoTransacciones = repoTransacciones;
    this.servicioPasarela = servicioPasarela;
  }

  async ejecutar({ orderId, userId }) {
    // 1. Buscar orden
    const orden = await this.repoOrdenes.obtenerPorId(orderId);
    if (!orden) {
      throw new Error('Orden no encontrada');
    }
    if (orden.estado_pago !== 'pendiente') {
      throw new Error('La orden no está pendiente de pago');
    }

    // 2. Crear entidad Pago
    const pago = new Pago({
      orderId: orden.id,
      userId: orden.user_id,
      monto: orden.monto_total,
      moneda: 'PEN',
      metodo: 'yape_izipay',
      estado: 'pendiente'
    });

    // 3. Llamar a la pasarela (IzipayAdapter)
    const { configPago, pagoActualizado } = await this.servicioPasarela.iniciarPagoYape(orden, pago);

    // 4. Registrar transacción en BD
    const { id } = await this.repoTransacciones.registrarTransaccionPago(pagoActualizado);
    pagoActualizado.id = id;

    // 5. Devolver datos para el frontend
    return {
      transaccionId: id,
      orderId: orden.id,
      numeroOrden: orden.numero_orden,
      configPago
    };
  }
}

module.exports = IniciarPagoYapeIzipay;
