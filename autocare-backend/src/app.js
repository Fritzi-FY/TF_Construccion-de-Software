require('dotenv').config();
const express = require('express');
const { poolPromise } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

const pagosRouter = require('./infraestructura/http/routers/PagosRouter');


const path = require('path'); // Módulo para manejar rutas de archivos

app.use(express.json()); // Middleware para parsear JSON
app.use('/api/pagos', pagosRouter); // Rutas para pagos

app.use(express.static(path.join(__dirname,'..', 'public'))); // Carpeta para archivos estáticos

app.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT TOP 1 * FROM products'); // tabla de tu script
    res.json({ ok: true, productoEjemplo: result.recordset[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error consultando BD' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

