# Noelia Tarditto Inmobiliaria

Sistema web completo de gestión inmobiliaria con backend REST API y frontend dinámico.

## 📋 Estructura del Proyecto

```
Noelia Tarditto Inmobiliaria/
├── backend/                    # Servidor Node.js + Express
│   ├── config/                # Configuración de base de datos
│   ├── controllers/           # Lógica de negocio
│   ├── routes/                # Definición de endpoints API
│   ├── sql/                   # Scripts SQL
│   ├── server.js              # Punto de entrada del servidor
│   └── package.json
├── css/                       # Estilos del sitio
│   └── style.css
├── img/                       # Imágenes y assets
│   ├── Propiedades/          # Fotos de propiedades
│   ├── preguntas-frecuentes/
│   └── quien soy/
├── Servicios/                 # Páginas de servicios
│   ├── Alquiler.html
│   ├── Ventas.html
│   └── Detalle-propiedad.html
├── Preguntas frecuentes/      # Página de FAQ
│   └── preguntas-frecuentes.html
├── main.js                    # JavaScript principal del frontend
└── Pagina Principal.html      # Página de inicio

## 🚀 Tecnologías

### Backend
- **Node.js** v18+
- **Express** 4.18.2
- **MySQL** 8.0+
- **mysql2** para conexión a BD
- **dotenv** para variables de entorno
- **cors** para habilitar CORS
- **body-parser** para parsear JSON

### Frontend
- **HTML5** semántico
- **CSS3** con variables y Flexbox/Grid
- **JavaScript ES6+** vanilla (sin frameworks)

### Base de Datos
- **MySQL** con tablas: `propiedad`, `imagen_propiedad`, `cliente`, `empleado`, `servicio`, `solicitud`, `tipo_servicio`

## 📦 Instalación

### 1. Clonar el repositorio
```bash
cd "C:/Users/Usuario/OneDrive/Desktop/workspace/Noelia Tarditto Inmobiliaria (4)- copia"
```

### 2. Configurar backend
```bash
cd backend
npm install
```

### 3. Configurar base de datos
Crear archivo `.env` en `backend/`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=inmobiliaria_db
DB_PORT=3306
PORT=3001
```

### 4. Importar base de datos
Ejecutar el script SQL para crear tablas y datos iniciales en MySQL.

## 🏃 Ejecutar el proyecto

### Backend
```bash
cd backend
npm start
# O para desarrollo con auto-reload:
npm run dev
```
El servidor estará disponible en `http://localhost:3001`

### Frontend
Abrir con Live Server (VS Code) o servidor local:
```bash
# Con Live Server en VS Code (puerto 5500 o 5502)
# O con Python:
python -m http.server 8000
```
Acceder a `http://localhost:5500` (o el puerto configurado)

## 🔌 API Endpoints

### Propiedades
- `GET /api/propiedades` - Obtener todas las propiedades
- `GET /api/propiedades/:id` - Obtener una propiedad
- `POST /api/propiedades` - Crear propiedad
- `PUT /api/propiedades/:id` - Actualizar propiedad
- `DELETE /api/propiedades/:id` - Eliminar propiedad

### Imágenes
- `GET /api/imagenes/propiedad/:id_prop` - Obtener imágenes de una propiedad
- `POST /api/imagenes` - Crear imagen
- `PUT /api/imagenes/:id` - Actualizar imagen
- `DELETE /api/imagenes/:id` - Eliminar imagen

### Otros endpoints
- `GET /api/clientes`
- `GET /api/empleados`
- `GET /api/servicios`
- `GET /api/solicitudes`
- `GET /api/tipos-servicios`

## 📝 Características

### Frontend
- ✅ Renderizado dinámico de propiedades desde API
- ✅ Sistema de filtros por tipo, ubicación, precio, habitaciones, superficie
- ✅ Normalización de texto con soporte para acentos (Junín, San Martín)
- ✅ Navegación a página de detalle con datos en localStorage
- ✅ Acordeón de preguntas frecuentes
- ✅ Formulario de contacto con integración a WhatsApp
- ✅ Soporte para imágenes múltiples por propiedad
- ✅ Imágenes placeholder automáticas si no hay fotos
- ✅ Rutas relativas compatibles con diferentes contextos

### Backend
- ✅ REST API completa con CRUD para todas las entidades
- ✅ Servicio estático de imágenes y CSS
- ✅ Manejo de errores centralizado
- ✅ Pool de conexiones MySQL
- ✅ CORS habilitado para desarrollo

### Base de Datos
- ✅ Esquema normalizado con relaciones FK
- ✅ ENUM para `estado` (alquilada/desocupada/comprada)
- ✅ ENUM para `tipo` (casa/departamento/local comercial/monoambiente/duplex)
- ✅ Sistema de orden para imágenes múltiples

## 🧩 Funciones principales en main.js

### `renderPropiedades(propiedades)`
Renderiza las tarjetas de propiedades en el grid con datos del API.

### `fetchAndRenderPropiedades()`
Obtiene propiedades desde la API y filtra por operación (alquiler/venta) según la página actual.

### `filtrarPropiedades()`
Filtra las propiedades visibles según los selectores de filtro.

### `normalizarTexto(txt)`
Normaliza textos eliminando acentos y convirtiendo a minúsculas.

### `inferOperacion(estadoRaw)`
Mapea el ENUM `estado` de la BD a 'alquiler' o 'venta'.

### `formatearTagEstado(estadoRaw)`
Convierte el ENUM `estado` a etiquetas visuales ("en alquiler", "en venta", "vendida").

### `resolveAssetPath(url)`
Resuelve rutas de assets para que funcionen desde raíz (`/`) y desde carpeta `Servicios/`.

### `cargarDetallePropiedad()`
Carga los datos de una propiedad desde localStorage en la página de detalle.

## 🐛 Solución de Problemas

### El backend no inicia
- Verificar que MySQL está corriendo
- Revisar credenciales en `.env`
- Ejecutar `npm install` en `backend/`

### Imágenes no cargan
- Verificar que el servidor backend esté corriendo en puerto 3001
- Comprobar que las URLs en la tabla `imagen_propiedad` sean correctas
- Las rutas deben ser relativas: `../img/Propiedades/...`

### Filtros no funcionan
- Abrir consola del navegador para ver errores
- Verificar que `data-*` attributes estén presentes en las tarjetas

### Propiedades no aparecen
- Verificar conexión a API: `http://localhost:3001/api/propiedades`
- Revisar consola del navegador
- Comprobar que el servidor backend esté ejecutándose

## 📄 Licencia

MIT © 2025 Noelia Tarditto Inmobiliaria
