const { poolPromise } = require('../config/db');
const Address = require('../../dominio/entidades/Address');

class RepositorioAddressesSql {
  async crear(address) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('user_id', address.userId)
      .input('address', address.address)
      .input('city', address.city)
      .input('state', address.state)
      .input('zip', address.zip)
      .input('country', address.country)
      .input('instructions', address.instructions)
      .input('created_at', address.createdAt)
      .query(`
        INSERT INTO Addresses (user_id, address, city, state, zip, country, instructions, created_at)
        OUTPUT INSERTED.*
        VALUES (@user_id, @address, @city, @state, @zip, @country, @instructions, @created_at)
      `);
    return Address.fromDatabase(result.recordset[0]);
  }

  async obtenerPorId(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Addresses WHERE id = @id');
    return result.recordset.length > 0 ? Address.fromDatabase(result.recordset[0]) : null;
  }

  async obtenerPorUsuario(userId) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('user_id', userId)
      .query('SELECT * FROM Addresses WHERE user_id = @user_id ORDER BY created_at DESC');
    return result.recordset.map(row => Address.fromDatabase(row));
  }

  async obtenerTodos() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Addresses ORDER BY created_at DESC');
    return result.recordset.map(row => Address.fromDatabase(row));
  }

  async actualizar(id, address) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', id)
      .input('address', address.address)
      .input('city', address.city)
      .input('state', address.state)
      .input('zip', address.zip)
      .input('country', address.country)
      .input('instructions', address.instructions)
      .query(`
        UPDATE Addresses
        SET address = @address, city = @city, state = @state, zip = @zip,
            country = @country, instructions = @instructions
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset.length > 0 ? Address.fromDatabase(result.recordset[0]) : null;
  }

  async eliminar(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Addresses WHERE id = @id');
  }
}

module.exports = RepositorioAddressesSql;
