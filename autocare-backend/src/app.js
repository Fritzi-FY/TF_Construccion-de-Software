require('dotenv').config();
const express = require('express');
const { poolPromise } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

