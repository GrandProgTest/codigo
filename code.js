const express = require('express');
const redis = require('redis');
const servidor = express();
const puerto = 3000;

// Configuración del cliente de Redis
const redisCliente = redis.createClient({ url: 'redis://localhost:6379' });

// Conexión al servidor de Redis
redisCliente.connect().catch((error) => console.error('Error de conexión:', error));

servidor.get('/worker', async (req, res) => {
  try {
    // Obtener el valor almacenado en Redis
    const resultado = await redisCliente.get('usuario:1000');
    if (resultado) {
      // Si existe el registro, lo enviamos como respuesta en formato JSON
      res.json(JSON.parse(resultado)); 
    } else {
      // Si no se encuentra, respondemos con un mensaje de error
      res.status(404).json({ error: 'Registro no encontrado' });
    }
  } catch (error) {
    // En caso de fallo en la conexión o la recuperación de datos, lo manejamos aquí
    res.status(500).json({ error: 'Error en el acceso a Redis', detalles: error.message });
  }
});

// Arrancar el servidor
servidor.listen(puerto, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${puerto}`);
});
