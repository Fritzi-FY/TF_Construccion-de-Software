require('dotenv').config();
const express = require('express');
const app = express();
const pagosRouter = require('./infraestructura/http/routers/PagosRouter');

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API AutoCare funcionando' });
});

// Montar módulo de pagos
app.use('/api/pagos', pagosRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
