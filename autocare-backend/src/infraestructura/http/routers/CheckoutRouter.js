const express = require('express');
const router = express.Router();

const RepositorioUsuariosSql = require('../../db/RepositorioUsuariosSql');
const RepositorioDireccionesSql = require('../../db/RepositorioDireccionesSql');
const RepositorioCarritoSql = require('../../db/RepositorioCarritoSql');

const repoUsuarios = new RepositorioUsuariosSql();
const repoDirecciones = new RepositorioDireccionesSql();
const repoCarrito = new RepositorioCarritoSql();

/**
 * POST /api/checkout
 * Body:
 * {
 *   cliente: { firstName, lastName, email, phone, dni },
 *   direccion: { address, city, state, zip, country, instructions },
 *   carrito: [{ id, quantity, price }],
 *   totales: { subtotal, igv, envio, total, promoCode }
 * }
 */
router.post('/checkout', async (req, res) => {
  const { cliente, direccion, carrito } = req.body;

  if (!cliente || !direccion || !Array.isArray(carrito)) {
    return res.status(400).json({ error: 'Datos incompletos para checkout' });
  }

  try {
    // 1) Crear usuario
    const userId = await repoUsuarios.crearUsuario({
      email: cliente.email,
      passwordHash: null,
      primerNombre: cliente.firstName,
      apellido: cliente.lastName,
      numeroDocumento: cliente.dni,
      telefono: cliente.phone
    });

    // 2) Crear dirección
    const addressId = await repoDirecciones.crearDireccion({
      userId,
      calle: direccion.address,
      numero: null,
      ciudad: direccion.city,
      provincia: direccion.state,
      codigoPostal: direccion.zip,
      departamento: direccion.city,
      pais: direccion.country,
      telefono: cliente.phone,
      referencia: direccion.instructions,
      esPredeterminada: true
    });

    // 3) Guardar carrito en shopping_cart
    await repoCarrito.guardarCarrito(userId, carrito);

    return res.json({ userId, addressId });
  } catch (err) {
    console.error('Error en /api/checkout:', err);
    return res.status(500).json({ error: 'No se pudo procesar el checkout' });
  }
});

module.exports = router;
