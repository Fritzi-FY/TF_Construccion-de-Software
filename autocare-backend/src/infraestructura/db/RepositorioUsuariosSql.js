// src/infraestructura/db/RepositorioUsuariosSql.js
const { poolPromise } = require('../../config/db');

class RepositorioUsuariosSql {
  async crearUsuario({ email, passwordHash, primerNombre, apellido, numeroDocumento, telefono }) {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('email', email)
      .input('password_hash', passwordHash || 'hash-demo') // por ahora dummy
      .input('primer_nombre', primerNombre)
      .input('apellido', apellido)
      .input('numero_documento', numeroDocumento)
      .input('telefono', telefono || null)
      .input('rol', 'customer')
      .input('estado', 'activo')
      .input('activo', 1)
      .query(`
        INSERT INTO users (
          email,
          password_hash,
          primer_nombre,
          apellido,
          numero_documento,
          telefono,
          rol,
          estado,
          activo,
          created_at
        )
        OUTPUT INSERTED.id
        VALUES (
          @email,
          @password_hash,
          @primer_nombre,
          @apellido,
          @numero_documento,
          @telefono,
          @rol,
          @estado,
          @activo,
          GETDATE()
        );
      `);

    return result.recordset[0].id;
  }
}

module.exports = RepositorioUsuariosSql;
