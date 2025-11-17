# Soporte de Imágenes para Propiedades - Guía de Uso

## Estructura de la Base de Datos

Se ha creado la tabla `imagen_propiedad` para almacenar imágenes asociadas a propiedades. Características:

- `id`: ID único de la imagen
- `id_prop`: FK a la tabla `propiedad`
- `url`: URL de la imagen (puede ser ruta relativa o URL absoluta)
- `descripcion`: Descripción opcional de la imagen
- `orden`: Orden de aparición en la galería (0 = imagen principal)
- `created_at`: Timestamp de creación

## Pasos para Activar las Imágenes

### 1. Importar la tabla en MySQL Workbench

Archivo: `backend/sql/imagen_propiedad.sql`

```sql
-- Abrir MySQL Workbench
-- Conectarse a tu servidor local
-- File -> Open SQL Script -> selecciona imagen_propiedad.sql
-- Ejecuta (Ctrl+Shift+Enter o botón Run)
```

### 2. Insertar propiedades de prueba (IMPORTANTE)

Primero, inserta algunas propiedades en la tabla `propiedad`:

```sql
INSERT INTO `propiedad` (`tipo`, `ciudad`, `calle`, `num_casa`, `sup_terreno`, `sup_cubierta`, `estado`, `precio`, `ambientes`, `descripcion`) VALUES
('casa', 'Rivadavia', 'Calle 1', '100', 250.00, 180.00, 'desocupada', 350000.00, '3 habitaciones', 'Casa Familiar en Rivadavia'),
('departamento', 'San Martin', 'Calle 2', '200', 150.00, 120.00, 'desocupada', 280000.00, '2 habitaciones', 'Departamento Moderno'),
('casa', 'Junin', 'Calle 3', '300', 500.00, 300.00, 'desocupada', 450000.00, '4 habitaciones', 'Casa Amplia en Junín');
```

Luego, obtén los IDs generados (suelen ser 1, 2, 3) y luego inserta imágenes:

```sql
INSERT INTO `imagen_propiedad` (`id_prop`, `url`, `descripcion`, `orden`) VALUES
(1, '../img/Propiedades/Alquiler/IMG_6570.jpg', 'Imagen principal', 0),
(1, '../img/Propiedades/Alquiler/IMG_6582.jpg', 'Fachada', 1),
(2, '../img/propiedad_placeholder_1.jpg', 'Departamento', 0),
(3, '../img/propiedad_placeholder_1.jpg', 'Casa', 0);
```

### 3. Endpoints REST para Imágenes

El backend ahora expone los siguientes endpoints:

**GET** `/api/imagenes/propiedad/:id_prop`
- Obtiene todas las imágenes de una propiedad, ordenadas por `orden`
- Ejemplo: `GET http://localhost:3001/api/imagenes/propiedad/1`

**GET** `/api/imagenes/:id`
- Obtiene una imagen específica por ID
- Ejemplo: `GET http://localhost:3001/api/imagenes/1`

**POST** `/api/imagenes`
- Crea una nueva imagen
- Body:
  ```json
  {
    "id_prop": 1,
    "url": "../img/Propiedades/Alquiler/IMG_6582.jpg",
    "descripcion": "Fachada principal",
    "orden": 0
  }
  ```

**PUT** `/api/imagenes/:id`
- Actualiza una imagen
- Body: (similar al POST)

**DELETE** `/api/imagenes/:id`
- Elimina una imagen

## Uso en el Frontend

### Cargar imágenes dinámicamente

El frontend ya integra soporte para cargar imágenes desde la API. Ejemplo:

```javascript
// Cargar imágenes de una propiedad
fetch('http://localhost:3001/api/imagenes/propiedad/1')
  .then(res => res.json())
  .then(imagenes => {
    imagenes.forEach((img, index) => {
      console.log(`${index}: ${img.url}`);
    });
  });
```

### Renderizado de galería

Cuando haces click en una tarjeta de propiedad, el frontend:
1. Guarda los datos en `localStorage` (incluyendo `id_prop`)
2. Navega a `Detalle-Propiedad.html`
3. La página de detalle puede cargar imágenes usando la API

### Modificar Detalle-Propiedad.html para usar imágenes dinámicas

Dentro de la función `cargarDetallePropiedad()` en `main.js`, puedes añadir:

```javascript
// Después de cargar datos de localStorage
const datosGuardados = localStorage.getItem('propiedadActual');
if (datosGuardados) {
  const datos = JSON.parse(datosGuardados);
  
  // Cargar imágenes desde la API
  if (datos.id_prop) {
    fetch(`http://localhost:3001/api/imagenes/propiedad/${datos.id_prop}`)
      .then(res => res.json())
      .then(imagenes => {
        if (imagenes.length > 0) {
          // Reemplaza la imagen principal
          const imagenPrincipal = document.getElementById('imagen-principal');
          if (imagenPrincipal) {
            imagenPrincipal.src = imagenes[0].url;
          }
          
          // Carga thumbnails
          const thumbnailsContainer = document.querySelector('.galeria-thumbnails');
          if (thumbnailsContainer) {
            thumbnailsContainer.innerHTML = '';
            imagenes.forEach((img, index) => {
              const thumb = document.createElement('img');
              thumb.src = img.url;
              thumb.alt = img.descripcion || 'Imagen';
              thumb.className = index === 0 ? 'thumbnail active' : 'thumbnail';
              thumb.onclick = () => cambiarImagenPrincipal(thumb);
              thumbnailsContainer.appendChild(thumb);
            });
          }
        }
      })
      .catch(err => console.error('Error cargando imágenes:', err));
  }
}
```

## Almacenamiento de imágenes

Actualmente, el sistema acepta URLs de imágenes. Opciones:

### 1. URLs relativas (actual)
```json
{
  "url": "../img/Propiedades/Alquiler/IMG_6582.jpg"
}
```

### 2. URLs absolutas
```json
{
  "url": "https://tu-dominio.com/imagenes/propiedad-1.jpg"
}
```

### 3. Subida de archivos (futuro)
Si quieres subir archivos en vez de usar URLs, necesitarás:
- Instalar `multer` en el backend
- Crear endpoint POST con procesamiento de archivos
- Guardar archivos en servidor o S3
- Guardar la URL generada en la BD

## Notas importantes

- Las imágenes se cargan en orden ascendente (por campo `orden`)
- La imagen con `orden = 0` se muestra como imagen principal
- El `id_prop` debe existir en la tabla `propiedad`
- El sistema maneja cascada de eliminación (eliminar una propiedad elimina sus imágenes)

## Probar los endpoints

Desde terminal, usa `curl`:

```bash
# Obtener imágenes de la propiedad 1
curl http://localhost:3001/api/imagenes/propiedad/1

# Crear una imagen nueva
curl -X POST http://localhost:3001/api/imagenes \
  -H "Content-Type: application/json" \
  -d '{"id_prop":1,"url":"../img/test.jpg","descripcion":"Test","orden":2}'

# Actualizar una imagen
curl -X PUT http://localhost:3001/api/imagenes/1 \
  -H "Content-Type: application/json" \
  -d '{"url":"../img/test-updated.jpg","descripcion":"Updated","orden":3}'

# Eliminar una imagen
curl -X DELETE http://localhost:3001/api/imagenes/1
```
