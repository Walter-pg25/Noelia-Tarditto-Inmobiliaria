# Backend - Inmobiliaria Tarditto

Backend REST API para la gestión de la inmobiliaria Tarditto, construido con Node.js y Express.

## Requisitos

- Node.js v14 o superior
- MySQL 8.0 o superior
- npm o yarn

## Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
   - Copiar `.env.example` a `.env`
   - Editar `.env` con tus credenciales de MySQL:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=inmuebles
DB_PORT=3306
PORT=3001
NODE_ENV=development
```

4. **Asegurarse de que la base de datos existe**
   - Importar el SQL proporcionado en MySQL

## Scripts

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en desarrollo con nodemon (requiere instalación de nodemon)

## Endpoints de la API

### Clientes
- `GET /api/clientes` - Obtener todos los clientes
- `GET /api/clientes/:id` - Obtener cliente por ID
- `POST /api/clientes` - Crear nuevo cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Propiedades
- `GET /api/propiedades` - Obtener todas las propiedades
- `GET /api/propiedades/:id` - Obtener propiedad por ID
- `POST /api/propiedades` - Crear nueva propiedad
- `PUT /api/propiedades/:id` - Actualizar propiedad
- `DELETE /api/propiedades/:id` - Eliminar propiedad

### Empleados
- `GET /api/empleados` - Obtener todos los empleados
- `GET /api/empleados/:id` - Obtener empleado por ID
- `POST /api/empleados` - Crear nuevo empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Eliminar empleado

### Servicios
- `GET /api/servicios` - Obtener todos los servicios
- `GET /api/servicios/:id` - Obtener servicio por ID
- `POST /api/servicios` - Crear nuevo servicio
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio

### Solicitudes
- `GET /api/solicitudes` - Obtener todas las solicitudes
- `GET /api/solicitudes/:id` - Obtener solicitud por ID
- `POST /api/solicitudes` - Crear nueva solicitud
- `PUT /api/solicitudes/:id` - Actualizar solicitud
- `DELETE /api/solicitudes/:id` - Eliminar solicitud

### Tipos de Servicios
- `GET /api/tipos-servicios` - Obtener todos los tipos de servicios
- `GET /api/tipos-servicios/:id` - Obtener tipo de servicio por ID
- `POST /api/tipos-servicios` - Crear nuevo tipo de servicio
- `PUT /api/tipos-servicios/:id` - Actualizar tipo de servicio
- `DELETE /api/tipos-servicios/:id` - Eliminar tipo de servicio

## Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de conexión a MySQL
├── controllers/             # Lógica de negocio
│   ├── clienteController.js
│   ├── propiedadController.js
│   ├── empleadoController.js
│   ├── servicioController.js
│   ├── solicitudController.js
│   └── tipoServicioController.js
├── routes/                  # Rutas de la API
│   ├── clientes.js
│   ├── propiedades.js
│   ├── empleados.js
│   ├── servicios.js
│   ├── solicitudes.js
│   └── tiposServicios.js
├── .env.example             # Variables de entorno (ejemplo)
├── .gitignore               # Archivos a ignorar en git
├── package.json             # Dependencias del proyecto
├── server.js                # Archivo principal
└── README.md                # Este archivo
```

## Notas Importantes

- El servidor escucha por defecto en `http://localhost:3001`
- Todos los endpoints retornan JSON
- En caso de error, se retorna el código HTTP correspondiente
- La conexión a la BD usa `mysql2/promise` para soporte asíncrono

## Próximas Mejoras Sugeridas

1. Agregar autenticación y autorización
2. Implementar validación de datos más robusta
3. Agregar tabla de imágenes para propiedades
4. Agregar logs más detallados
5. Implementar paginación en listados
6. Agregar filtros avanzados

---

Desarrollado para Inmobiliaria Tarditto
