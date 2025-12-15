// Representa un intento de pago asociado a una orden existente
class Pago {
  constructor({ id = null, orderId, userId, monto, moneda = 'PEN', metodo = 'yape_izipay', estado = 'pendiente', referenciaPasarela = null }) {
    this.id = id;
    this.orderId = orderId;
    this.userId = userId;
    this.monto = monto;
    this.moneda = moneda;
    this.metodo = metodo;          // yape_izipay, tarjeta, etc.
    this.estado = estado;          // pendiente, completada, fallida
    this.referenciaPasarela = referenciaPasarela;
  }
}

module.exports = Pago;
