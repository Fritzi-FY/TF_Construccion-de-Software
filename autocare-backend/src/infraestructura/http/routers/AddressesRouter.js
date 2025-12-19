const express = require('express');
const RepositorioAddressesSql = require('../../db/RepositorioAddressesSql');

const router = express.Router();
const repo = new RepositorioAddressesSql();

// GET /api/addresses - Obtener todas las direcciones
router.get('/', async (req, res) => {
  try {
    const addresses = await repo.obtenerTodos();
    res.json(addresses);
  } catch (error) {
    console.error('Error al obtener direcciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/addresses/:id - Obtener dirección por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const address = await repo.obtenerPorId(parseInt(id));
    if (!address) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    res.json(address);
  } catch (error) {
    console.error('Error al obtener dirección:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/addresses/user/:userId - Obtener direcciones por usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await repo.obtenerPorUsuario(parseInt(userId));
    res.json(addresses);
  } catch (error) {
    console.error('Error al obtener direcciones del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/addresses - Crear nueva dirección
router.post('/', async (req, res) => {
  try {
    const { userId, address, city, state, zip, country, instructions } = req.body;

    if (!userId || !address || !city || !state || !zip || !country) {
      return res.status(400).json({ error: 'Campos requeridos: userId, address, city, state, zip, country' });
    }

    const newAddress = await repo.crear({
      userId,
      address,
      city,
      state,
      zip,
      country,
      instructions: instructions || '',
      createdAt: new Date()
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error al crear dirección:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/addresses/:id - Actualizar dirección
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { address, city, state, zip, country, instructions } = req.body;

    const existingAddress = await repo.obtenerPorId(parseInt(id));
    if (!existingAddress) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }

    const updatedAddress = await repo.actualizar(parseInt(id), {
      address: address || existingAddress.address,
      city: city || existingAddress.city,
      state: state || existingAddress.state,
      zip: zip || existingAddress.zip,
      country: country || existingAddress.country,
      instructions: instructions !== undefined ? instructions : existingAddress.instructions
    });

    res.json(updatedAddress);
  } catch (error) {
    console.error('Error al actualizar dirección:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/addresses/:id - Eliminar dirección
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const address = await repo.obtenerPorId(parseInt(id));
    if (!address) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }

    await repo.eliminar(parseInt(id));
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar dirección:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
