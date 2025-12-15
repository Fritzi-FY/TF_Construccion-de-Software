// Puerto de dominio: define qué debe hacer una pasarela de pagos
class ServicioPasarelaPagos {
  /**
   * Inicia un pago con Yape a través de una pasarela (Izipay en nuestra implementación).
   * Debe devolver un objeto de configuración/token para que el frontend cargue el formulario.
   */
  async iniciarPagoYape(orden, pago) {
    throw new Error('Método iniciarPagoYape no implementado');
  }
}

module.exports = ServicioPasarelaPagos;
