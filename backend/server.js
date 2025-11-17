const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir carpeta de imágenes y otros assets estáticos (opcional)
// Esto permite acceder a http://localhost:3001/img/propiedad_placeholder_1.jpg
app.use('/img', express.static(path.join(__dirname, '..', 'img')));
app.use('/css', express.static(path.join(__dirname, '..', 'css')));

// Rutas
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/propiedades', require('./routes/propiedades'));
app.use('/api/empleados', require('./routes/empleados'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/solicitudes', require('./routes/solicitudes'));
app.use('/api/tipos-servicios', require('./routes/tiposServicios'));
app.use('/api/imagenes', require('./routes/imagenes'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend funcionando correctamente' });
});

// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Pagina Principal.html'));
  });
} else {
  // Ruta raíz - Página de bienvenida (solo en desarrollo)
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Inmobiliaria Tarditto</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          h1 { color: #333; }
          .endpoint { background: #f4f4f4; padding: 10px; margin: 10px 0; border-radius: 5px; }
          .method { color: #0066cc; font-weight: bold; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>🏠 API Inmobiliaria Noelia Tarditto</h1>
        <p>El backend está funcionando correctamente.</p>
        
        <h2>Endpoints Disponibles:</h2>
        
        <div class="endpoint">
          <span class="method">GET</span> <a href="/api/health">/api/health</a> - Estado del servidor
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <a href="/api/propiedades">/api/propiedades</a> - Todas las propiedades
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <a href="/api/imagenes/propiedad/1">/api/imagenes/propiedad/:id</a> - Imágenes de una propiedad
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <a href="/api/clientes">/api/clientes</a> - Todos los clientes
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <a href="/api/empleados">/api/empleados</a> - Todos los empleados
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <a href="/api/servicios">/api/servicios</a> - Todos los servicios
        </div>
        
        <p><strong>Frontend:</strong> Para acceder al sitio web, usa un servidor estático para servir los archivos HTML.</p>
      </body>
      </html>
    `);
  });
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.RAILWAY_STATIC_URL ? '0.0.0.0' : '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  const address = server.address();
  console.log(`✓ Servidor ejecutándose en puerto ${PORT}`);
  console.log(`✓ Escuchando en ${address.address}:${address.port}`);
  console.log(`✓ NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ HOST: ${HOST}`);
  
  // Test inmediato de conectividad
  console.log(`✓ Servidor listo para recibir conexiones`);
});
