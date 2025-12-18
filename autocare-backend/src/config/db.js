const sql = require('mssql');

const config = {
  // Sin user/password -> usa credenciales de Windows del proceso
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST || 'FRITZ',
  database: process.env.DB_NAME || 'AutoCareDB',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Conectado a SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Error de conexión a SQL Server', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};
