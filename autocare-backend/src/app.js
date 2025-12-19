require('dotenv').config();
const express = require('express');
const { poolPromise } = require('./config/db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Routers
const pagosRouter    = require('./infraestructura/http/routers/PagosRouter');
const checkoutRouter = require('./infraestructura/http/routers/CheckoutRouter');
const ordenesRouter  = require('./infraestructura/http/routers/OrdenesRouter'); // ← nuevo

app.use(express.json());

// Rutas API
app.use('/api/pagos', pagosRouter);   // /api/pagos/...
app.use('/api', checkoutRouter);      // /api/checkout
app.use('/api', ordenesRouter);       // /api/ordenes

// Archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ruta de prueba
app.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT TOP 1 * FROM products');
    res.json({ ok: true, productoEjemplo: result.recordset[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error consultando BD' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});


