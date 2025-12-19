const { poolPromise } = require('../config/db');
const PromoCode = require('../../dominio/entidades/PromoCode');

class RepositorioPromoCodesSql {
  async crear(promoCode) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('code', promoCode.code)
      .input('discount_type', promoCode.discountType)
      .input('discount_value', promoCode.discountValue)
      .input('valid_from', promoCode.validFrom)
      .input('valid_to', promoCode.validTo)
      .input('max_uses', promoCode.maxUses)
      .input('current_uses', promoCode.currentUses)
      .input('is_active', promoCode.isActive)
      .query(`
        INSERT INTO PromoCodes (code, discount_type, discount_value, valid_from, valid_to, max_uses, current_uses, is_active)
        OUTPUT INSERTED.*
        VALUES (@code, @discount_type, @discount_value, @valid_from, @valid_to, @max_uses, @current_uses, @is_active)
      `);
    return PromoCode.fromDatabase(result.recordset[0]);
  }

  async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', id)
      .query('SELECT * FROM PromoCodes WHERE id = @id');
    return result.recordset.length > 0 ? PromoCode.fromDatabase(result.recordset[0]) : null;
  }

  async obtenerPorCodigo(code) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('code', code)
      .query('SELECT * FROM PromoCodes WHERE code = @code');
    return result.recordset.length > 0 ? PromoCode.fromDatabase(result.recordset[0]) : null;
  }

  async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM PromoCodes ORDER BY valid_from DESC');
    return result.recordset.map(row => PromoCode.fromDatabase(row));
  }

  async actualizar(id, promoCode) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', id)
      .input('code', promoCode.code)
      .input('discount_type', promoCode.discountType)
      .input('discount_value', promoCode.discountValue)
      .input('valid_from', promoCode.validFrom)
      .input('valid_to', promoCode.validTo)
      .input('max_uses', promoCode.maxUses)
      .input('current_uses', promoCode.currentUses)
      .input('is_active', promoCode.isActive)
      .query(`
        UPDATE PromoCodes
        SET code = @code, discount_type = @discount_type, discount_value = @discount_value,
            valid_from = @valid_from, valid_to = @valid_to, max_uses = @max_uses,
            current_uses = @current_uses, is_active = @is_active
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset.length > 0 ? PromoCode.fromDatabase(result.recordset[0]) : null;
  }

  async incrementarUso(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', id)
      .query(`
        UPDATE PromoCodes
        SET current_uses = current_uses + 1
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset.length > 0 ? PromoCode.fromDatabase(result.recordset[0]) : null;
  }

  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', id)
      .query('DELETE FROM PromoCodes WHERE id = @id');
  }
}

module.exports = RepositorioPromoCodesSql;
