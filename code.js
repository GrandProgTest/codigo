const express = require('express');
const redis = require('redis');
const servidor = express();


const redisCliente = redis.createClient({ url: 'redis://localhost:6379' });

redisCliente.connect().catch((error) => console.error('Error de conexión:', error));

servidor.get('/worker', async (req, res) => {
  try {
    const resultado = await redisCliente.get('usuario:1000');
    if (resultado) {
      res.json(JSON.parse(resultado)); 
    } else {
      res.status(404).json({ error: 'Registro no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en el acceso a Redis', detalles: error.message });
  }
});

servidor.listen(() => {
  console.log(`Servidor en funcionamiento en http://localhost:3000`);
});
