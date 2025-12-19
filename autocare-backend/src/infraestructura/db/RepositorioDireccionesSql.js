// src/infraestructura/db/RepositorioDireccionesSql.js
const { poolPromise } = require('../../config/db');

class RepositorioDireccionesSql {
  async crearDireccion({
    userId,
    calle,
    numero,
    ciudad,
    provincia,
    codigoPostal,
    departamento,
    pais,
    telefono,
    referencia,
    esPredeterminada
  }) {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('user_id', userId)
      .input('tipo_direccion', 'domicilio')
      .input('calle', calle)
      .input('numero', numero || null)
      .input('apartamento', null)
      .input('ciudad', ciudad)
      .input('provincia', provincia)
      .input('codigo_postal', codigoPostal || null)
      .input('departamento', departamento || null)
      .input('pais', pais || 'Perú')
      .input('telefono', telefono || null)
      .input('referencia', referencia || null)
      .input('es_predeterminada', esPredeterminada ? 1 : 0)
      .input('activa', 1)
      .query(`
        INSERT INTO addresses (
          user_id,
          tipo_direccion,
          calle,
          numero,
          apartamento,
          ciudad,
          provincia,
          codigo_postal,
          departamento,
          pais,
          telefono,
          referencia,
          es_predeterminada,
          activa,
          created_at
        )
        OUTPUT INSERTED.id
        VALUES (
          @user_id,
          @tipo_direccion,
          @calle,
          @numero,
          @apartamento,
          @ciudad,
          @provincia,
          @codigo_postal,
          @departamento,
          @pais,
          @telefono,
          @referencia,
          @es_predeterminada,
          @activa,
          GETDATE()
        );
      `);

    return result.recordset[0].id;
  }
}

module.exports = RepositorioDireccionesSql;
