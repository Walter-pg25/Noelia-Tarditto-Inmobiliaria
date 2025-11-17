# 📚 Documentación Técnica - Noelia Tarditto Inmobiliaria

## Índice
1. [Arquitectura General](#arquitectura-general)
2. [Backend - Estructura y Funcionamiento](#backend---estructura-y-funcionamiento)
3. [Frontend - Estructura y Funcionamiento](#frontend---estructura-y-funcionamiento)
4. [Base de Datos](#base-de-datos)
5. [Flujo de Datos](#flujo-de-datos)
6. [Sistema de Rutas y Navegación](#sistema-de-rutas-y-navegación)

---

## Arquitectura General

El sistema está dividido en tres capas principales:

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Cliente)                    │
│  HTML + CSS + JavaScript Vanilla (main.js)              │
│  Puerto: 5500 (Live Server) o 8000 (Python)             │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP Requests (fetch API)
                      ↓
┌─────────────────────────────────────────────────────────┐
│                BACKEND (Servidor API)                    │
│           Node.js + Express + MySQL2                     │
│              Puerto: 3001                                │
└─────────────────────┬───────────────────────────────────┘
                      │ SQL Queries
                      ↓
┌─────────────────────────────────────────────────────────┐
│                   BASE DE DATOS                          │
│                    MySQL 8.0+                            │
│              Puerto: 3306                                │
└─────────────────────────────────────────────────────────┘
```

---

## Backend - Estructura y Funcionamiento

### 📁 `/backend/server.js`
**Propósito:** Punto de entrada principal del servidor. Configura y arranca toda la aplicación.

**Qué hace:**
```javascript
// 1. Carga dependencias
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Lee variables de .env

// 2. Crea la aplicación Express
const app = express();

// 3. Configura middlewares
app.use(cors()); // Permite peticiones desde otros dominios
app.use(bodyParser.json()); // Parsea JSON del body
app.use(bodyParser.urlencoded({ extended: true })); // Parsea formularios

// 4. Sirve archivos estáticos (imágenes, CSS)
app.use('/img', express.static(path.join(__dirname, '..', 'img')));
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
```

**Montaje de rutas:**
Cada `app.use()` conecta una ruta base con su archivo de rutas correspondiente:

```javascript
app.use('/api/clientes', require('./routes/clientes'));
// Todas las rutas en routes/clientes.js estarán bajo /api/clientes
// Ejemplo: GET /api/clientes, POST /api/clientes, etc.

app.use('/api/propiedades', require('./routes/propiedades'));
app.use('/api/empleados', require('./routes/empleados'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/solicitudes', require('./routes/solicitudes'));
app.use('/api/tipos-servicios', require('./routes/tiposServicios'));
app.use('/api/imagenes', require('./routes/imagenes'));
```

**Iniciar servidor:**
```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
```

---

### 📁 `/backend/config/database.js`
**Propósito:** Crear y exportar el pool de conexiones a MySQL.

**Qué hace:**
```javascript
const mysql = require('mysql2');

// Crea un pool de conexiones (reutiliza conexiones, más eficiente)
const pool = mysql.createPool({
  host: process.env.DB_HOST,        // localhost
  user: process.env.DB_USER,        // root
  password: process.env.DB_PASSWORD, // tu contraseña
  database: process.env.DB_NAME,    // inmobiliaria_db
  port: process.env.DB_PORT,        // 3306
  waitForConnections: true,
  connectionLimit: 10,              // Máximo 10 conexiones simultáneas
  queueLimit: 0
});

module.exports = pool.promise(); // Exporta versión con Promises
```

**¿Por qué un pool?**
- En lugar de abrir/cerrar conexiones constantemente, el pool mantiene conexiones abiertas.
- Mejora el rendimiento y maneja múltiples peticiones concurrentes.

---

### 📁 `/backend/routes/` (Definición de Rutas)

Cada archivo define los **endpoints** para una entidad. Usa `express.Router()` para crear mini-aplicaciones de rutas.

#### Ejemplo: `/backend/routes/propiedades.js`

```javascript
const express = require('express');
const router = express.Router();
const propiedadController = require('../controllers/propiedadController');

// GET /api/propiedades - Obtener todas las propiedades
router.get('/', propiedadController.obtenerPropiedades);

// GET /api/propiedades/:id - Obtener una propiedad específica
router.get('/:id', propiedadController.obtenerPropiedadPorId);

// POST /api/propiedades - Crear una nueva propiedad
router.post('/', propiedadController.crearPropiedad);

// PUT /api/propiedades/:id - Actualizar una propiedad
router.put('/:id', propiedadController.actualizarPropiedad);

// DELETE /api/propiedades/:id - Eliminar una propiedad
router.delete('/:id', propiedadController.eliminarPropiedad);

module.exports = router;
```

**Estructura de rutas completas:**
```
/backend/routes/
├── clientes.js          → /api/clientes/*
├── propiedades.js       → /api/propiedades/*
├── empleados.js         → /api/empleados/*
├── servicios.js         → /api/servicios/*
├── solicitudes.js       → /api/solicitudes/*
├── tiposServicios.js    → /api/tipos-servicios/*
└── imagenes.js          → /api/imagenes/*
```

#### Ejemplo especial: `/backend/routes/imagenes.js`

```javascript
// GET /api/imagenes/propiedad/:id_prop
// Obtiene TODAS las imágenes de una propiedad específica
router.get('/propiedad/:id_prop', imagenController.obtenerImagenesPorPropiedad);

// GET /api/imagenes/:id
// Obtiene UNA imagen específica por su ID
router.get('/:id', imagenController.obtenerImagenPorId);

// POST /api/imagenes
router.post('/', imagenController.crearImagen);

// PUT /api/imagenes/:id
router.put('/:id', imagenController.actualizarImagen);

// DELETE /api/imagenes/:id
router.delete('/:id', imagenController.eliminarImagen);
```

---

### 📁 `/backend/controllers/` (Lógica de Negocio)

Los controladores contienen la **lógica real** de cada operación. Interactúan con la base de datos.

#### Ejemplo: `/backend/controllers/propiedadController.js`

```javascript
const db = require('../config/database');

// GET /api/propiedades
exports.obtenerPropiedades = async (req, res) => {
  try {
    // Ejecuta query SQL
    const [rows] = await db.query('SELECT * FROM propiedad');
    
    // Envía respuesta JSON con código 200 (OK)
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error obteniendo propiedades:', error);
    res.status(500).json({ error: 'Error al obtener propiedades' });
  }
};

// GET /api/propiedades/:id
exports.obtenerPropiedadPorId = async (req, res) => {
  try {
    const { id } = req.params; // Extrae :id de la URL
    const [rows] = await db.query(
      'SELECT * FROM propiedad WHERE id_prop = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo propiedad:', error);
    res.status(500).json({ error: 'Error al obtener propiedad' });
  }
};

// POST /api/propiedades
exports.crearPropiedad = async (req, res) => {
  try {
    const { tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, 
            estado, precio, ambientes, descripcion } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO propiedad (tipo, ciudad, calle, num_casa, sup_terreno, 
                              sup_cubierta, estado, precio, ambientes, descripcion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, 
       estado, precio, ambientes, descripcion]
    );
    
    res.status(201).json({ 
      id_prop: result.insertId,
      mensaje: 'Propiedad creada exitosamente' 
    });
  } catch (error) {
    console.error('Error creando propiedad:', error);
    res.status(500).json({ error: 'Error al crear propiedad' });
  }
};

// PUT /api/propiedades/:id
exports.actualizarPropiedad = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, 
            estado, precio, ambientes, descripcion } = req.body;
    
    const [result] = await db.query(
      `UPDATE propiedad 
       SET tipo=?, ciudad=?, calle=?, num_casa=?, sup_terreno=?, 
           sup_cubierta=?, estado=?, precio=?, ambientes=?, descripcion=?
       WHERE id_prop=?`,
      [tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, 
       estado, precio, ambientes, descripcion, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    
    res.status(200).json({ mensaje: 'Propiedad actualizada exitosamente' });
  } catch (error) {
    console.error('Error actualizando propiedad:', error);
    res.status(500).json({ error: 'Error al actualizar propiedad' });
  }
};

// DELETE /api/propiedades/:id
exports.eliminarPropiedad = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      'DELETE FROM propiedad WHERE id_prop = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    
    res.status(200).json({ mensaje: 'Propiedad eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando propiedad:', error);
    res.status(500).json({ error: 'Error al eliminar propiedad' });
  }
};
```

#### Controlador especial: `/backend/controllers/imagenController.js`

```javascript
// Obtiene todas las imágenes de una propiedad, ordenadas por campo 'orden'
exports.obtenerImagenesPorPropiedad = async (req, res) => {
  try {
    const { id_prop } = req.params;
    
    const [rows] = await db.query(
      `SELECT * FROM imagen_propiedad 
       WHERE id_prop = ? 
       ORDER BY orden ASC`,
      [id_prop]
    );
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error obteniendo imágenes:', error);
    res.status(500).json({ error: 'Error al obtener imágenes' });
  }
};
```

**Flujo completo de una petición:**
```
Cliente hace: GET http://localhost:3001/api/propiedades
    ↓
server.js recibe la petición
    ↓
Middleware CORS y bodyParser procesan
    ↓
app.use('/api/propiedades', ...) matchea la ruta
    ↓
routes/propiedades.js → router.get('/', ...)
    ↓
propiedadController.obtenerPropiedades()
    ↓
db.query('SELECT * FROM propiedad')
    ↓
MySQL devuelve filas
    ↓
res.status(200).json(rows) envía respuesta
    ↓
Cliente recibe JSON con todas las propiedades
```

---

### 📁 `/backend/sql/` (Scripts SQL)

#### `imagen_propiedad.sql`
Contiene el schema completo para la tabla de imágenes:

```sql
CREATE TABLE imagen_propiedad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_prop INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  descripcion TEXT,
  orden INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_prop) REFERENCES propiedad(id_prop) ON DELETE CASCADE
);
```

#### `imagen_insert_examples.sql`
Ejemplos de INSERT para poblar la tabla con datos de prueba.

---

## Frontend - Estructura y Funcionamiento

### 📄 `Pagina Principal.html`
**Propósito:** Landing page del sitio.

**Secciones:**
1. **Header con navegación**
   - Logo clicable (scroll a inicio)
   - Menú desplegable responsive
   - Enlaces a: Servicios, Propiedades, Preguntas Frecuentes, Contacto

2. **Hero Section**
   - Imagen de fondo (`[000031] copia.jpg`)
   - Logo grande central
   - Texto de presentación

3. **Servicios Grid**
   - 2 tarjetas principales: Alquiler y Ventas
   - Enlaces a `Servicios/Alquiler.html` y `Servicios/Ventas.html`

4. **Sección "Quién Soy"**
   - Imagen personal (`IMG_7721.jpg`)
   - Texto descriptivo sobre la inmobiliaria

5. **Formulario de Contacto**
   - Captura: nombre, teléfono, email, mensaje
   - Al enviar, redirige a WhatsApp con los datos pre-formateados

6. **Footer**
   - Información de contacto
   - Enlaces rápidos
   - Redes sociales

**Enlaces relevantes:**
```html
<!-- Navegación interna -->
<a href="Servicios/Alquiler.html">Alquiler</a>
<a href="Servicios/Ventas.html">Ventas</a>
<a href="Preguntas frecuentes/preguntas-frecuentes.html">FAQ</a>

<!-- Assets -->
<link rel="stylesheet" href="./css/style.css">
<script src="./main.js"></script>
<img src="./img/quien soy/IMG_7721.jpg">
```

---

### 📄 `Servicios/Alquiler.html` y `Servicios/Ventas.html`
**Propósito:** Mostrar propiedades filtradas por operación (alquiler o venta).

**Estructura:**
1. **Header** (igual que la página principal)
2. **Sección de filtros**
   ```html
   <select id="tipo-propiedad">
     <option value="">Todos</option>
     <option value="casa">Casa</option>
     <option value="departamento">Departamento</option>
     <option value="local comercial">Local Comercial</option>
     <!-- etc -->
   </select>
   
   <select id="ubicacion">
     <!-- Se puebla dinámicamente desde main.js -->
   </select>
   
   <select id="precio"><!-- Rangos de precio --></select>
   <select id="habitaciones"><!-- 1, 2, 3+ --></select>
   <select id="superficie"><!-- Rangos m² --></select>
   ```

3. **Grid de propiedades**
   ```html
   <div id="propiedades-grid">
     <!-- Las tarjetas se insertan dinámicamente desde main.js -->
   </div>
   
   <div id="sin-resultados" style="display:none;">
     No hay propiedades que coincidan con los filtros
   </div>
   ```

4. **Footer**

**Diferencia entre Alquiler.html y Ventas.html:**
- El archivo en sí es casi idéntico
- `main.js` detecta la URL actual y filtra las propiedades:
  - Si URL contiene "alquiler" → muestra propiedades con estado "alquilada"
  - Si URL contiene "venta" → muestra propiedades con estado "desocupada" o "comprada"

---

### 📄 `Servicios/Detalle-propiedad.html`
**Propósito:** Mostrar información completa de UNA propiedad específica.

**Cómo llega el usuario aquí:**
1. Usuario hace clic en una tarjeta de propiedad en Alquiler.html o Ventas.html
2. `main.js` guarda datos en `localStorage`
3. Navega a `Detalle-propiedad.html?id=X`
4. `main.js` carga datos de `localStorage` y rellena la página

**Secciones:**
1. **Galería de imágenes**
   - Carrusel con las fotos de la propiedad
   
2. **Información principal**
   ```html
   <h1 id="titulo-propiedad"><!-- Nombre de la propiedad --></h1>
   <p id="ubicacion-propiedad"><!-- Ciudad, Mendoza --></p>
   <span id="estado-tag"><!-- "en alquiler" / "en venta" --></span>
   <p id="precio-propiedad"><!-- $45,000 --></p>
   ```

3. **Características**
   ```html
   <p id="tipo-propiedad"><!-- Casa, Departamento, etc --></p>
   <p id="habitaciones-propiedad"><!-- 3 habitaciones --></p>
   <p id="banos-propiedad"><!-- 2 baños --></p>
   <p id="superficie-terreno"><!-- 320 m² terreno --></p>
   <p id="superficie-cubierta"><!-- 224 m² cubiertos --></p>
   ```

4. **Formulario de consulta**
   - Similar al de la página principal
   - Pre-incluye el nombre de la propiedad en el mensaje de WhatsApp

---

### 📄 `Preguntas frecuentes/preguntas-frecuentes.html`
**Propósito:** Acordeón de preguntas frecuentes.

**Estructura:**
```html
<div class="pregunta-acordeon">
  <div class="pregunta-header">
    <h3>¿Título de la pregunta?</h3>
    <span class="icono-acordeon">+</span>
  </div>
  <div class="pregunta-contenido">
    <p>Respuesta a la pregunta...</p>
  </div>
</div>
```

**Funcionalidad (en main.js):**
- Al hacer clic en `pregunta-header`, se añade/quita clase `activo`
- Solo una pregunta puede estar abierta a la vez
- Scroll suave hacia la pregunta abierta

---

### 📄 `main.js` - JavaScript Principal

**Es el cerebro del frontend.** Contiene toda la lógica de interacción.

#### 1️⃣ **Inicialización (DOMContentLoaded)**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Todo el código se ejecuta cuando el DOM está listo
});
```

#### 2️⃣ **Menú desplegable responsive**
```javascript
const botonMenu = document.getElementById('boton-menu');
const menuDesplegable = document.getElementById('menu-desplegable');

botonMenu.addEventListener('click', () => {
  menuDesplegable.classList.toggle('menu-activo');
});
```

#### 3️⃣ **Scroll suave para anclas**
```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
```

#### 4️⃣ **Acordeón de preguntas frecuentes**
```javascript
const preguntasAcordeon = document.querySelectorAll('.pregunta-acordeon');

preguntasAcordeon.forEach((pregunta) => {
  const header = pregunta.querySelector('.pregunta-header');
  
  header.addEventListener('click', (e) => {
    e.preventDefault();
    const estaActiva = pregunta.classList.contains('activo');
    
    // Cerrar todas las preguntas
    preguntasAcordeon.forEach(p => p.classList.remove('activo'));
    
    // Abrir la clickeada si no estaba activa
    if (!estaActiva) {
      pregunta.classList.add('activo');
      // Scroll suave hacia ella
      setTimeout(() => {
        const yOffset = -100;
        const y = pregunta.getBoundingClientRect().top + 
                  window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 300);
    }
  });
});
```

#### 5️⃣ **Formulario de contacto (Página Principal)**
```javascript
const formularioPrincipal = document.querySelector('.formulario1 form');

formularioPrincipal.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Capturar datos
  const nombre = this.querySelector('input[type="text"]').value;
  const telefono = this.querySelector('input[type="tel"]').value;
  const email = this.querySelector('input[type="email"]').value;
  const mensaje = this.querySelector('textarea').value;
  
  // Formatear mensaje para WhatsApp
  let mensajeWhatsApp = ` *Consulta General desde la Web*%0A%0A`;
  mensajeWhatsApp += ` *Nombre:* ${nombre}%0A`;
  mensajeWhatsApp += ` *Teléfono:* ${telefono}%0A`;
  mensajeWhatsApp += ` *Email:* ${email}%0A%0A`;
  mensajeWhatsApp += ` *Mensaje:*%0A${encodeURIComponent(mensaje)}`;
  
  const numeroWhatsApp = '5492634715111';
  
  // Abrir WhatsApp en nueva pestaña
  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`, '_blank');
  
  this.reset();
  alert('¡Gracias por tu consulta! Te redirigimos a WhatsApp.');
});
```

#### 6️⃣ **Sistema de propiedades dinámicas**

##### `formatPrice(num)`
```javascript
function formatPrice(num) {
  if (!num && num !== 0) return '$0';
  return '$' + Number(num).toLocaleString('es-AR');
}
// formatPrice(45000) → "$45.000"
```

##### `renderPropiedades(propiedades)`
**Convierte array de propiedades en HTML y lo inserta en el DOM.**

```javascript
function renderPropiedades(propiedades) {
  if (!propiedadesGrid || !Array.isArray(propiedades)) return;
  
  const ubicacionesSet = new Set();
  
  const html = propiedades.map((p, index) => {
    const tipo = p.tipo || 'casa';
    const ciudad = p.ciudad || 'Rivadavia';
    const estadoRaw = (p.estado || '').toString();
    const estadoNorm = formatearTagEstado(estadoRaw);
    
    // Nombre: descripción o fallback
    const nombre = p.descripcion && p.descripcion.trim().length > 0
      ? (p.descripcion.length > 50 ? p.descripcion.slice(0, 50) + '...' : p.descripcion)
      : `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${estadoNorm} en ${ciudad}`;
    
    const superficie = p.sup_terreno || p.sup_cubierta || 0;
    const precio = p.precio || 0;
    const habitaciones = (p.ambientes && typeof p.ambientes === 'string') 
      ? (p.ambientes.match(/(\d+)/) ? p.ambientes.match(/(\d+)/)[0] : '0') 
      : '0';
    const propiedadId = p.id_prop || index;
    
    ubicacionesSet.add(ciudad.trim());
    
    return `
      <div class="propiedad-card" 
           data-id-prop="${propiedadId}" 
           data-tipo="${tipo}" 
           data-ubicacion="${ciudad.toLowerCase()}" 
           data-precio="${precio}" 
           data-hab="${habitaciones}" 
           data-superficie="${superficie}" 
           data-estado="${inferOperacion(estadoRaw)}">
        <div class="propiedad-imagen-contenedor">
          <span class="propiedad-tag">${estadoNorm}</span>
          <img src="${resolveAssetPath('img/propiedad_placeholder_1.jpg')}" 
               alt="${nombre}" 
               class="propiedad-imagen" 
               data-prop-id="${propiedadId}">
        </div>
        <div class="propiedad-info">
          <h3 class="propiedad-nombre">${nombre}</h3>
          <p class="propiedad-caracteristicas">${p.ambientes || ''}</p>
          <p class="propiedad-descripcion">${p.descripcion || ''}</p>
          <p class="propiedad-caracteristicas">Superficie: ${superficie} m² - ${ciudad}</p>
          <div class="propiedad-footer">
            <p class="propiedad-precio">${formatPrice(precio)}</p>
            <a href="Detalle-propiedad.html" class="propiedad-boton">Detalles</a>
          </div>
        </div>
      </div>`;
  }).join('');
  
  propiedadesGrid.innerHTML = html;
  
  // Actualizar select de ubicaciones dinámicamente
  const selectUbicacion = document.getElementById('ubicacion');
  if (selectUbicacion) {
    const valorAnterior = selectUbicacion.value;
    selectUbicacion.innerHTML = '<option value="">Todas</option>';
    
    Array.from(ubicacionesSet)
      .sort((a,b) => a.localeCompare(b, 'es'))
      .forEach(ciu => {
        const opt = document.createElement('option');
        opt.value = ciu;
        opt.textContent = ciu;
        selectUbicacion.appendChild(opt);
      });
    
    if (valorAnterior) selectUbicacion.value = valorAnterior;
  }
  
  // Cargar imágenes reales desde la API
  propiedades.forEach((p) => {
    const propiedadId = p.id_prop;
    const imgElement = propiedadesGrid.querySelector(`img[data-prop-id="${propiedadId}"]`);
    
    if (imgElement) {
      imgElement.onerror = () => {
        if (!imgElement.dataset.fallbackApplied) {
          imgElement.dataset.fallbackApplied = 'true';
          imgElement.src = resolveAssetPath('img/propiedad_placeholder_1.jpg');
        }
      };
      
      fetch(`http://localhost:3001/api/imagenes/propiedad/${propiedadId}`)
        .then(res => res.json())
        .then(imagenes => {
          if (imagenes && imagenes.length > 0) {
            const imagenPrincipal = imagenes.sort((a, b) => a.orden - b.orden)[0];
            imgElement.src = resolveAssetPath(imagenPrincipal.url);
          }
        })
        .catch(() => {}); // Silencioso, usará placeholder
    }
  });
}
```

**Flujo:**
1. Recibe array de propiedades desde la API
2. Por cada propiedad, genera HTML con `data-*` attributes
3. Inserta HTML en `propiedades-grid`
4. Actualiza select de ubicaciones con ciudades únicas
5. Para cada propiedad, hace fetch a `/api/imagenes/propiedad/:id`
6. Si hay imágenes, reemplaza placeholder con imagen real
7. Si falla, mantiene placeholder

##### `initPropertyCards()`
**Añade event listeners a las tarjetas para navegar al detalle.**

```javascript
function initPropertyCards() {
  if (!propiedadesGrid) return;
  const tarjetas = propiedadesGrid.querySelectorAll('.propiedad-card');
  
  tarjetas.forEach((tarjeta) => {
    tarjeta.style.cursor = 'pointer';
    const propiedadId = tarjeta.getAttribute('data-id-prop');
    
    tarjeta.addEventListener('click', (e) => {
      // Si hicieron clic en el botón "Detalles", no hacer nada (el enlace funcionará)
      if (e.target.classList.contains('propiedad-boton') || 
          e.target.closest('.propiedad-boton')) {
        return;
      }
      
      // Capturar datos de la tarjeta
      const imagenesGaleria = [];
      const imagenPrincipal = tarjeta.querySelector('.propiedad-imagen')?.src;
      if (imagenPrincipal) imagenesGaleria.push(imagenPrincipal);
      
      let tipoOperacion = 'Venta';
      const pathname = window.location.pathname.toLowerCase();
      const tagTexto = tarjeta.querySelector('.propiedad-tag')?.textContent.toLowerCase() || '';
      
      if (pathname.includes('alquiler')) tipoOperacion = 'Alquiler';
      else if (pathname.includes('venta')) tipoOperacion = 'Venta';
      
      if (tagTexto.includes('alquiler')) tipoOperacion = 'Alquiler';
      else if (tagTexto.includes('venta')) tipoOperacion = 'Venta';
      
      const datosPropiedad = {
        id: propiedadId,
        id_prop: propiedadId,
        nombre: tarjeta.querySelector('.propiedad-nombre')?.textContent || 'Propiedad',
        tipo: tarjeta.getAttribute('data-tipo') || 'casa',
        ubicacion: tarjeta.getAttribute('data-ubicacion') || 'Rivadavia',
        precio: tarjeta.querySelector('.propiedad-precio')?.textContent || '$0',
        caracteristicas: tarjeta.querySelector('.propiedad-caracteristicas')?.textContent || '',
        imagenes: imagenesGaleria,
        tag: tarjeta.querySelector('.propiedad-tag')?.textContent || 'EN VENTA',
        habitaciones: tarjeta.getAttribute('data-hab') || '0',
        superficie: tarjeta.getAttribute('data-superficie') || '0',
        operacion: tipoOperacion,
        video: null
      };
      
      // Guardar en localStorage
      localStorage.setItem('propiedadActual', JSON.stringify(datosPropiedad));
      
      // Navegar a detalle
      window.location.href = `Detalle-Propiedad.html?id=${propiedadId}`;
    });
  });
  
  // Re-aplicar filtros después de inicializar
  if (typeof filtrarPropiedades === 'function') filtrarPropiedades();
}
```

##### `fetchAndRenderPropiedades()`
**Obtiene propiedades de la API y renderiza.**

```javascript
async function fetchAndRenderPropiedades() {
  if (!propiedadesGrid) return;
  
  try {
    const res = await fetch('http://localhost:3001/api/propiedades');
    if (!res.ok) return;
    
    const data = await res.json();
    
    if (Array.isArray(data) && data.length > 0) {
      // Filtrar por página (alquiler o venta)
      const pathname = window.location.pathname.toLowerCase();
      let propiedadesFiltradas = data;
      
      if (pathname.includes('alquiler')) {
        propiedadesFiltradas = data.filter(p => 
          inferOperacion(p.estado) === 'alquiler'
        );
      } else if (pathname.includes('venta')) {
        propiedadesFiltradas = data.filter(p => 
          inferOperacion(p.estado) === 'venta'
        );
      }
      
      renderPropiedades(propiedadesFiltradas);
      initPropertyCards();
    } else {
      initPropertyCards(); // Por si hay HTML estático
    }
  } catch (err) {
    initPropertyCards(); // Fallback a contenido estático
  }
}

// Ejecutar si estamos en página con grid
if (propiedadesGrid) {
  fetchAndRenderPropiedades();
}
```

#### 7️⃣ **Funciones utilitarias**

##### `normalizarTexto(txt)`
**Quita acentos y convierte a minúsculas.**

```javascript
function normalizarTexto(txt) {
  return (txt || '')
    .toString()
    .toLowerCase()
    .normalize('NFD') // Descompone caracteres con acentos
    .replace(/[\u0300-\u036f]/g, '') // Elimina marcas diacríticas
    .trim();
}

// Ejemplos:
// normalizarTexto("Junín") → "junin"
// normalizarTexto("San Martín") → "san martin"
```

##### `resolveAssetPath(url)`
**Resuelve rutas relativas según el contexto.**

```javascript
function resolveAssetPath(url) {
  if (!url) return '';
  
  // Si es URL absoluta (http/https), devolverla tal cual
  const isHttp = /^https?:\/\//i.test(url);
  if (isHttp) return url;
  
  // Detectar si estamos en /Servicios/ o en raíz
  const isServicios = window.location.pathname.toLowerCase().includes('/servicios/');
  const base = isServicios ? '../' : './';
  
  // Limpiar barras iniciales
  const cleaned = url.replace(/^\/+/, '');
  
  // Si ya empieza con img/, añadir base
  if (cleaned.startsWith('img/')) return base + cleaned;
  
  // Si ya tiene ../, devolverlo
  if (cleaned.startsWith('../img/')) return cleaned;
  
  // Otras rutas
  return cleaned.startsWith('./') ? cleaned : base + cleaned;
}

// Ejemplos:
// En Pagina Principal.html:
//   resolveAssetPath('img/foto.jpg') → './img/foto.jpg'
// En Servicios/Alquiler.html:
//   resolveAssetPath('img/foto.jpg') → '../img/foto.jpg'
```

##### `inferOperacion(estadoRaw)`
**Mapea ENUM estado de BD a 'alquiler' o 'venta'.**

```javascript
function inferOperacion(estadoRaw) {
  const e = normalizarTexto(estadoRaw);
  if (!e) return 'venta';
  if (e.includes('alquil')) return 'alquiler';
  if (e.includes('desocup')) return 'venta';
  if (e.includes('comprad')) return 'venta';
  if (e.includes('venta')) return 'venta';
  return 'venta';
}

// Mapeo:
// 'alquilada' → 'alquiler'
// 'desocupada' → 'venta' (disponible para venta)
// 'comprada' → 'venta' (ya vendida)
```

##### `formatearTagEstado(estadoRaw)`
**Convierte estado a etiqueta visual.**

```javascript
function formatearTagEstado(estadoRaw) {
  const op = inferOperacion(estadoRaw);
  
  // Si está comprada, mostrar "vendida"
  if (normalizarTexto(estadoRaw).includes('comprad')) return 'vendida';
  
  // Sino, según operación
  return op === 'alquiler' ? 'en alquiler' : 'en venta';
}

// Ejemplos:
// 'alquilada' → 'en alquiler'
// 'desocupada' → 'en venta'
// 'comprada' → 'vendida'
```

#### 8️⃣ **Sistema de filtros**

```javascript
function filtrarPropiedades() {
  const propiedades = propiedadesGrid.querySelectorAll('.propiedad-card');
  let propiedadesVisibles = 0;
  
  // Obtener valores de filtros
  const tipoSeleccionado = filtroTipo ? normalizarTexto(filtroTipo.value) : '';
  const ubicacionSeleccionada = filtroUbicacion ? normalizarTexto(filtroUbicacion.value) : '';
  const precioMaximo = filtroPrecio && filtroPrecio.value ? parseInt(filtroPrecio.value) : null;
  const habitacionesSeleccionadas = filtroHabitaciones ? filtroHabitaciones.value : '';
  const superficieRango = filtroSuperficie ? filtroSuperficie.value : '';
  
  propiedades.forEach((propiedad) => {
    // Extraer data attributes
    const tipo = normalizarTexto(propiedad.getAttribute('data-tipo'));
    const ubicacion = normalizarTexto(propiedad.getAttribute('data-ubicacion'));
    const precio = parseInt(propiedad.getAttribute('data-precio') || '0');
    const habitaciones = parseInt(propiedad.getAttribute('data-hab') || '0');
    const superficie = parseInt(propiedad.getAttribute('data-superficie') || '0');
    
    let mostrar = true;
    
    // Filtro por tipo
    if (tipoSeleccionado && tipo !== tipoSeleccionado) {
      mostrar = false;
    }
    
    // Filtro por ubicación (normalizado para soportar acentos)
    if (ubicacionSeleccionada && ubicacion !== ubicacionSeleccionada) {
      mostrar = false;
    }
    
    // Filtro por precio
    if (precioMaximo && precio > precioMaximo) {
      mostrar = false;
    }
    
    // Filtro por habitaciones
    if (habitacionesSeleccionadas) {
      if (habitacionesSeleccionadas === '3+') {
        if (habitaciones < 3) mostrar = false;
      } else {
        if (habitaciones !== parseInt(habitacionesSeleccionadas)) mostrar = false;
      }
    }
    
    // Filtro por superficie
    if (superficieRango) {
      const [min, max] = superficieRango.split('-').map(Number);
      if (max) {
        if (superficie < min || superficie > max) mostrar = false;
      } else {
        if (superficie < min) mostrar = false;
      }
    }
    
    // Aplicar visibilidad
    if (mostrar) {
      propiedad.style.display = '';
      propiedadesVisibles++;
    } else {
      propiedad.style.display = 'none';
    }
  });
  
  // Mostrar/ocultar mensaje de "sin resultados"
  if (sinResultados) {
    sinResultados.style.display = propiedadesVisibles === 0 ? 'block' : 'none';
  }
}

// Event listeners en cada filtro
if (filtroTipo) filtroTipo.addEventListener('change', filtrarPropiedades);
if (filtroUbicacion) filtroUbicacion.addEventListener('change', filtrarPropiedades);
if (filtroPrecio) filtroPrecio.addEventListener('input', filtrarPropiedades);
if (filtroHabitaciones) filtroHabitaciones.addEventListener('change', filtrarPropiedades);
if (filtroSuperficie) filtroSuperficie.addEventListener('change', filtrarPropiedades);
```

#### 9️⃣ **Cargar detalle de propiedad**

```javascript
function cargarDetallePropiedad() {
  const datosGuardados = localStorage.getItem('propiedadActual');
  if (!datosGuardados) return;
  
  const datos = JSON.parse(datosGuardados);
  
  // Rellenar elementos
  const titulo = document.getElementById('titulo-propiedad');
  if (titulo) titulo.textContent = datos.nombre;
  
  const ubicacion = document.getElementById('ubicacion-propiedad');
  if (ubicacion) {
    const svg = ubicacion.querySelector('svg');
    ubicacion.innerHTML = '';
    if (svg) ubicacion.appendChild(svg);
    const texto = document.createTextNode(
      ` ${datos.ubicacion.charAt(0).toUpperCase() + datos.ubicacion.slice(1)}, Mendoza`
    );
    ubicacion.appendChild(texto);
  }
  
  const precio = document.getElementById('precio-propiedad');
  if (precio) precio.textContent = datos.precio;
  
  const tipo = document.getElementById('tipo-propiedad');
  if (tipo) tipo.textContent = datos.tipo.charAt(0).toUpperCase() + datos.tipo.slice(1);
  
  const tag = document.getElementById('estado-tag');
  if (tag) tag.textContent = datos.tag;
  
  const habitaciones = document.getElementById('habitaciones-propiedad');
  if (habitaciones) {
    const numHab = datos.habitaciones;
    habitaciones.textContent = numHab === '0' 
      ? 'Sin habitaciones' 
      : `${numHab} habitacion${numHab === '1' ? '' : 'es'}`;
  }
  
  // ... más campos similares
  
  // Configurar formulario de consulta
  const formularioConsulta = document.getElementById('formulario-consulta');
  if (formularioConsulta) {
    formularioConsulta.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nombre = document.getElementById('nombre-consulta').value;
      const telefono = document.getElementById('telefono-consulta').value;
      const email = document.getElementById('email-consulta').value;
      const mensaje = document.getElementById('mensaje-consulta').value;
      
      let mensajeWhatsApp = ` *Consulta sobre ${datos.nombre}*%0A%0A`;
      mensajeWhatsApp += ` *Ubicación:* ${datos.ubicacion}%0A`;
      mensajeWhatsApp += ` *Precio:* ${datos.precio}%0A%0A`;
      mensajeWhatsApp += ` *Datos del interesado:*%0A`;
      mensajeWhatsApp += ` *Nombre:* ${nombre}%0A`;
      mensajeWhatsApp += ` *Teléfono:* ${telefono}%0A`;
      mensajeWhatsApp += ` *Email:* ${email}%0A%0A`;
      mensajeWhatsApp += ` *Consulta:*%0A${encodeURIComponent(mensaje)}`;
      
      const numeroWhatsApp = '5492634715111';
      window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`, '_blank');
      
      this.reset();
      alert('¡Consulta enviada! Te redirigimos a WhatsApp.');
    });
  }
}

// Ejecutar si estamos en página de detalle
if (window.location.pathname.includes('Detalle-Propiedad') || 
    window.location.pathname.includes('Detalle-propiedad')) {
  cargarDetallePropiedad();
}
```

---

### 📁 `css/style.css`
**Propósito:** Todos los estilos del sitio.

**Secciones principales:**
- Variables CSS (colores, fuentes)
- Reset y estilos base
- Header y navegación
- Hero section
- Grid de propiedades
- Cards de propiedades
- Página de detalle
- Formularios
- Footer
- Media queries para responsive
- Estilos de acordeón
- Animaciones

---

## Base de Datos

### Esquema principal

```sql
-- Tabla de propiedades
CREATE TABLE propiedad (
  id_prop INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('casa', 'departamento', 'local comercial', 'monoambiente', 'duplex'),
  ciudad VARCHAR(100),
  calle VARCHAR(100),
  num_casa VARCHAR(10),
  sup_terreno DECIMAL(10,2),
  sup_cubierta DECIMAL(10,2),
  estado ENUM('alquilada', 'desocupada', 'comprada'),
  precio DECIMAL(10,2),
  ambientes VARCHAR(255),
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de imágenes (1 propiedad → muchas imágenes)
CREATE TABLE imagen_propiedad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_prop INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  descripcion TEXT,
  orden INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_prop) REFERENCES propiedad(id_prop) ON DELETE CASCADE
);

-- Otras tablas
CREATE TABLE cliente (...);
CREATE TABLE empleado (...);
CREATE TABLE servicio (...);
CREATE TABLE solicitud (...);
CREATE TABLE tipo_servicio (...);
```

### Relaciones importantes

```
propiedad (1) ←→ (N) imagen_propiedad
   ↓
   id_prop (PK)
```

**ON DELETE CASCADE:** Si se elimina una propiedad, sus imágenes se eliminan automáticamente.

---

## Flujo de Datos Completo

### Ejemplo 1: Usuario ve propiedades en alquiler

```
1. Usuario navega a: http://localhost:5500/Servicios/Alquiler.html
   ↓
2. Navegador carga HTML, CSS y main.js
   ↓
3. main.js detecta que existe #propiedades-grid
   ↓
4. Ejecuta fetchAndRenderPropiedades()
   ↓
5. fetch('http://localhost:3001/api/propiedades')
   ↓
6. Backend (server.js) recibe la petición
   ↓
7. Ruta /api/propiedades → routes/propiedades.js → router.get('/')
   ↓
8. Llama a propiedadController.obtenerPropiedades()
   ↓
9. Ejecuta: db.query('SELECT * FROM propiedad')
   ↓
10. MySQL devuelve todas las propiedades
   ↓
11. Controller envía: res.status(200).json(rows)
   ↓
12. main.js recibe JSON con propiedades
   ↓
13. Detecta URL contiene "alquiler"
   ↓
14. Filtra: data.filter(p => inferOperacion(p.estado) === 'alquiler')
   ↓
15. Llama renderPropiedades(propiedadesFiltradas)
   ↓
16. Por cada propiedad:
    - Genera HTML de tarjeta
    - Inserta en #propiedades-grid
    - Hace fetch a /api/imagenes/propiedad/:id
   ↓
17. Backend consulta: SELECT * FROM imagen_propiedad WHERE id_prop=? ORDER BY orden
   ↓
18. Devuelve array de imágenes
   ↓
19. main.js toma primera imagen (orden 0) y actualiza <img src="">
   ↓
20. Llama initPropertyCards() para añadir event listeners
   ↓
21. Usuario ve las propiedades con filtros funcionales
```

### Ejemplo 2: Usuario hace clic en una propiedad

```
1. Usuario hace clic en tarjeta de propiedad
   ↓
2. initPropertyCards() detecta el clic
   ↓
3. Captura todos los datos de la tarjeta (nombre, precio, ubicación, etc.)
   ↓
4. Crea objeto datosPropiedad
   ↓
5. localStorage.setItem('propiedadActual', JSON.stringify(datosPropiedad))
   ↓
6. window.location.href = 'Detalle-Propiedad.html?id=X'
   ↓
7. Navegador carga Detalle-propiedad.html
   ↓
8. main.js detecta URL contiene "Detalle"
   ↓
9. Ejecuta cargarDetallePropiedad()
   ↓
10. Lee: localStorage.getItem('propiedadActual')
   ↓
11. Parsea JSON y rellena elementos HTML
    - titulo-propiedad
    - ubicacion-propiedad
    - precio-propiedad
    - etc.
   ↓
12. Usuario ve página de detalle completa
```

### Ejemplo 3: Usuario aplica filtros

```
1. Usuario selecciona "Junín" en filtro de ubicación
   ↓
2. Event listener detecta 'change' en #ubicacion
   ↓
3. Ejecuta filtrarPropiedades()
   ↓
4. Recorre todas las .propiedad-card
   ↓
5. Para cada tarjeta:
    - Lee data-ubicacion
    - Normaliza con normalizarTexto() (quita acentos)
    - Compara con ubicacionSeleccionada (normalizada)
   ↓
6. Si coincide: propiedad.style.display = ''
   Si no: propiedad.style.display = 'none'
   ↓
7. Usuario ve solo propiedades de Junín
```

---

## Sistema de Rutas y Navegación

### Enlaces entre páginas

```
Pagina Principal.html (raíz)
   │
   ├─→ Servicios/Alquiler.html
   │    └─→ Servicios/Detalle-propiedad.html
   │
   ├─→ Servicios/Ventas.html
   │    └─→ Servicios/Detalle-propiedad.html
   │
   └─→ Preguntas frecuentes/preguntas-frecuentes.html
```

### Rutas relativas según contexto

**Desde Pagina Principal.html (raíz):**
```html
<link rel="stylesheet" href="./css/style.css">
<script src="./main.js"></script>
<img src="./img/quien soy/IMG_7721.jpg">
<a href="Servicios/Alquiler.html">Alquiler</a>
```

**Desde Servicios/Alquiler.html (subcarpeta):**
```html
<link rel="stylesheet" href="../css/style.css">
<script src="../main.js"></script>
<img src="../img/LOGOS PARA FONDO BLANCO NT PNG FONDO TRANPARENCIA 25 (1).png">
<a href="../Pagina Principal.html">Inicio</a>
```

**Función resolveAssetPath() maneja esto automáticamente:**
```javascript
// En raíz: './img/foto.jpg'
// En Servicios/: '../img/foto.jpg'
```

---

## Endpoints API Completos

### Propiedades
```
GET    /api/propiedades              → Todas las propiedades
GET    /api/propiedades/:id          → Una propiedad
POST   /api/propiedades              → Crear propiedad
PUT    /api/propiedades/:id          → Actualizar propiedad
DELETE /api/propiedades/:id          → Eliminar propiedad
```

### Imágenes
```
GET    /api/imagenes/propiedad/:id_prop  → Todas las imágenes de una propiedad
GET    /api/imagenes/:id                 → Una imagen
POST   /api/imagenes                     → Crear imagen
PUT    /api/imagenes/:id                 → Actualizar imagen
DELETE /api/imagenes/:id                 → Eliminar imagen
```

### Clientes
```
GET    /api/clientes
GET    /api/clientes/:id
POST   /api/clientes
PUT    /api/clientes/:id
DELETE /api/clientes/:id
```

### Empleados
```
GET    /api/empleados
GET    /api/empleados/:id
POST   /api/empleados
PUT    /api/empleados/:id
DELETE /api/empleados/:id
```

### Servicios
```
GET    /api/servicios
GET    /api/servicios/:id
POST   /api/servicios
PUT    /api/servicios/:id
DELETE /api/servicios/:id
```

### Solicitudes
```
GET    /api/solicitudes
GET    /api/solicitudes/:id
POST   /api/solicitudes
PUT    /api/solicitudes/:id
DELETE /api/solicitudes/:id
```

### Tipos de Servicio
```
GET    /api/tipos-servicios
GET    /api/tipos-servicios/:id
POST   /api/tipos-servicios
PUT    /api/tipos-servicios/:id
DELETE /api/tipos-servicios/:id
```

---

## Resumen de Tecnologías y Patrones

### Patrones de Diseño
- **MVC modificado:** Controllers manejan lógica, Routes definen endpoints
- **REST API:** Endpoints semánticos con verbos HTTP apropiados
- **Separation of Concerns:** Frontend y Backend completamente separados
- **Progressive Enhancement:** Funciona con HTML estático si la API falla

### Tecnologías Clave
- **Express.js:** Framework web minimalista
- **mysql2/promise:** Cliente MySQL con soporte de Promises
- **CORS:** Permite peticiones cross-origin durante desarrollo
- **localStorage:** Persistencia de datos temporales en el navegador
- **Fetch API:** Peticiones HTTP asíncronas desde JavaScript

### Buenas Prácticas Implementadas
- ✅ Variables de entorno (.env) para credenciales
- ✅ Pool de conexiones para MySQL
- ✅ Manejo de errores try/catch
- ✅ Códigos HTTP semánticos (200, 201, 404, 500)
- ✅ Normalización de texto para búsquedas
- ✅ Imágenes con fallback a placeholder
- ✅ Rutas relativas adaptativas
- ✅ Event delegation cuando es apropiado
- ✅ Responsive design con media queries
- ✅ Accesibilidad básica (alt en imágenes, labels en forms)

---

## Glosario de Términos

- **API:** Application Programming Interface - interfaz para comunicar frontend y backend
- **REST:** Representational State Transfer - estilo de arquitectura para APIs
- **Endpoint:** URL específica que responde a una petición
- **CRUD:** Create, Read, Update, Delete - operaciones básicas
- **Pool de conexiones:** Conjunto de conexiones reutilizables a la BD
- **Middleware:** Función que procesa requests antes de llegar a las rutas
- **Controller:** Lógica de negocio que maneja una operación específica
- **Route:** Definición de un endpoint (método HTTP + path)
- **Promise:** Objeto que representa el resultado futuro de una operación asíncrona
- **Async/Await:** Sintaxis para manejar Promises de forma síncrona
- **localStorage:** Almacenamiento local del navegador (persistente entre sesiones)
- **CORS:** Cross-Origin Resource Sharing - política de seguridad del navegador
- **JSON:** JavaScript Object Notation - formato de intercambio de datos
- **ENUM:** Tipo de dato que solo permite valores específicos predefinidos

---

**Documento generado el:** 16 de Noviembre de 2025  
**Versión del proyecto:** 1.0.0  
**Autor:** GitHub Copilot para Noelia Tarditto Inmobiliaria
