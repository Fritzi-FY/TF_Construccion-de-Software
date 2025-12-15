const ServicioPasarelaPagos = require('../../dominio/servicios/ServicioPasarelaPagos');
// const axios = require('axios'); // si luego llamas a API de Izipay

class IzipayAdapter extends ServicioPasarelaPagos {
  constructor({ merchantCode, environment }) {
    super();
    this.merchantCode = merchantCode;
    this.environment = environment || 'sandbox';
  }

  /**
   * Por ahora devolvemos una configuración simulada para el formulario embebido.
   * Luego la puedes ajustar con los parámetros reales de Izipay (formToken, etc.).
   */
  async iniciarPagoYape(orden, pago) {
    const transactionId = `TX-${Date.now()}`;

    // Aquí puedes crear el objeto que el frontend usará para inicializar el SDK de Izipay
    const configPago = {
      merchantCode: this.merchantCode,
      transactionId,
      orderNumber: orden.numeroorden,
      amount: pago.monto,
      currency: pago.moneda,
      payMethod: 'YAPE_CODE',   // clave importante para Yape
      environment: this.environment
    };

    // Registramos la referencia en el dominio
    pago.referenciaPasarela = transactionId;

    return { configPago, pagoActualizado: pago };
  }
}

module.exports = IzipayAdapter;
