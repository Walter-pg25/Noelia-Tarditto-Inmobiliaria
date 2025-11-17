# 🚀 Guía Paso a Paso: Deploy en Railway.app

## Requisitos Previos
- ✅ Cuenta de GitHub (gratuita)
- ✅ Cuenta de Railway (gratuita - sin tarjeta de crédito necesaria)
- ✅ Git instalado en tu PC

---

## Paso 1: Preparar el Proyecto para Deploy

### 1.1 Crear archivo `.gitignore` en la raíz del proyecto

```bash
cd "C:/Users/Usuario/OneDrive/Desktop/workspace/Noelia Tarditto Inmobiliaria (4)- copia"
```

Crear archivo `.gitignore` con este contenido:

```
# Node modules
node_modules/
backend/node_modules/

# Environment variables
.env
backend/.env

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db
desktop.ini

# IDE
.vscode/
.idea/

# Temporary files
*.tmp
*.temp
```

### 1.2 Modificar `main.js` para usar variable de entorno

Necesitamos que el frontend use la URL correcta del backend en producción.

**Buscar en `main.js` todas las líneas con:**
```javascript
fetch('http://localhost:3001/api/propiedades')
fetch('http://localhost:3001/api/imagenes/propiedad/${propiedadId}')
```

**Cambiar por:**
```javascript
// Al inicio del archivo, después de DOMContentLoaded
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : 'https://tu-backend.up.railway.app'; // Cambiarás esto después del deploy

// Luego usar:
fetch(`${API_URL}/api/propiedades`)
fetch(`${API_URL}/api/imagenes/propiedad/${propiedadId}`)
```

### 1.3 Modificar `server.js` para servir el frontend

Agregar al final de `backend/server.js` (antes del `app.listen`):

```javascript
// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Pagina Principal.html'));
  });
}
```

### 1.4 Actualizar `backend/package.json`

Verificar que tenga estos scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## Paso 2: Subir el Proyecto a GitHub

### 2.1 Inicializar Git en tu proyecto

```bash
cd "C:/Users/Usuario/OneDrive/Desktop/workspace/Noelia Tarditto Inmobiliaria (4)- copia"
git init
git add .
git commit -m "Initial commit - Inmobiliaria Tarditto"
```

### 2.2 Crear repositorio en GitHub

1. Ve a https://github.com
2. Haz clic en **"New repository"** (botón verde)
3. Nombre: `inmobiliaria-tarditto` (o el que prefieras)
4. **NO marques** "Add README" ni ".gitignore"
5. Clic en **"Create repository"**

### 2.3 Conectar tu proyecto local con GitHub

```bash
# Reemplaza TU_USUARIO con tu usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/inmobiliaria-tarditto.git
git branch -M main
git push -u origin main
```

Si te pide usuario/contraseña, usa tu **Personal Access Token** de GitHub (no tu contraseña).

---

## Paso 3: Deploy en Railway

### 3.1 Crear cuenta en Railway

1. Ve a https://railway.app
2. Clic en **"Start a New Project"**
3. Inicia sesión con GitHub (clic en "Login with GitHub")
4. Autoriza Railway para acceder a tus repositorios

### 3.2 Crear nuevo proyecto

1. Clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona `inmobiliaria-tarditto` (tu repositorio)
4. Railway detectará automáticamente que es un proyecto Node.js

### 3.3 Configurar variables de entorno

1. En el proyecto, clic en tu servicio (aparecerá el nombre del repo)
2. Ve a la pestaña **"Variables"**
3. Agrega las siguientes variables:

```
NODE_ENV=production
PORT=3001
```

**IMPORTANTE:** Por ahora NO agregues las variables de MySQL (DB_HOST, DB_USER, etc.). Primero necesitamos crear la base de datos.

### 3.4 Agregar base de datos MySQL

1. En el dashboard del proyecto, clic en **"+ New"**
2. Selecciona **"Database"**
3. Selecciona **"Add MySQL"**
4. Railway creará automáticamente una base de datos MySQL

### 3.5 Conectar el backend con MySQL

1. Clic en el servicio **MySQL** que acabas de crear
2. Ve a la pestaña **"Variables"**
3. Verás variables como:
   - `MYSQL_URL`
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

4. Vuelve al servicio de tu aplicación (el repositorio)
5. En **"Variables"**, agrega (copiando los valores de MySQL):

```
DB_HOST=[copiar de MYSQL_HOST]
DB_USER=[copiar de MYSQL_USER]
DB_PASSWORD=[copiar de MYSQL_PASSWORD]
DB_NAME=[copiar de MYSQL_DATABASE]
DB_PORT=[copiar de MYSQL_PORT]
```

### 3.6 Importar tu base de datos

Railway no tiene interfaz web para MySQL, necesitas conectarte con un cliente:

**Opción A: Usar MySQL Workbench**

1. Abre MySQL Workbench
2. Crea nueva conexión con los datos de Railway:
   - Hostname: (valor de MYSQL_HOST)
   - Port: (valor de MYSQL_PORT)
   - Username: (valor de MYSQL_USER)
   - Password: (valor de MYSQL_PASSWORD)
3. Conecta y ejecuta tu script SQL para crear tablas e insertar datos

**Opción B: Usar Railway CLI**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Conectar a MySQL
railway connect mysql

# Ahora estás en la consola de MySQL, ejecuta:
source ruta/a/tu/script.sql
```

---

## Paso 4: Configurar Dominio y URL

### 4.1 Obtener URL pública

1. En tu servicio de aplicación en Railway
2. Ve a **"Settings"**
3. En la sección **"Networking"**, clic en **"Generate Domain"**
4. Railway te dará una URL como: `https://inmobiliaria-tarditto-production.up.railway.app`

### 4.2 Actualizar `main.js` con la URL real

1. Edita `main.js` localmente
2. Cambia:
```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : 'https://inmobiliaria-tarditto-production.up.railway.app'; // TU URL DE RAILWAY
```

3. Guarda y sube los cambios:
```bash
git add main.js
git commit -m "Update API URL for production"
git push
```

Railway detectará el push y redesplegará automáticamente (tarda 1-2 minutos).

---

## Paso 5: Verificar que Todo Funciona

### 5.1 Acceder a tu sitio

Abre en el navegador: `https://tu-app.up.railway.app`

### 5.2 Verificar API

Prueba estos endpoints:
- `https://tu-app.up.railway.app/api/health`
- `https://tu-app.up.railway.app/api/propiedades`
- `https://tu-app.up.railway.app/api/imagenes/propiedad/1`

### 5.3 Verificar Frontend

- Navega a Alquiler y Ventas
- Verifica que carguen las propiedades desde la base de datos
- Prueba los filtros
- Verifica que las imágenes carguen correctamente

---

## Paso 6: Configurar CORS (si hay problemas)

Si ves errores de CORS en la consola del navegador, actualiza `backend/server.js`:

```javascript
// Cambiar:
app.use(cors());

// Por:
const corsOptions = {
  origin: [
    'http://localhost:5500',
    'http://localhost:8000',
    'https://tu-app.up.railway.app'
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

---

## Solución de Problemas Comunes

### Problema 1: "Application failed to respond"

**Causa:** El servidor no está escuchando en el puerto correcto.

**Solución:** Verificar que `server.js` use `process.env.PORT`:
```javascript
const PORT = process.env.PORT || 3001;
```

### Problema 2: "Cannot connect to database"

**Causa:** Variables de entorno de MySQL incorrectas.

**Solución:**
1. Ve al servicio MySQL en Railway
2. Copia exactamente los valores de las variables
3. Pégalos en las variables de tu aplicación

### Problema 3: "404 on CSS/Images"

**Causa:** Rutas relativas no funcionan en producción.

**Solución:** Asegúrate de que `server.js` sirva archivos estáticos:
```javascript
app.use('/img', express.static(path.join(__dirname, '..', 'img')));
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
```

### Problema 4: "Mixed Content" (HTTP/HTTPS)

**Causa:** Intentando cargar recursos HTTP desde una página HTTPS.

**Solución:** Asegúrate de que todas las URLs en tu código usen HTTPS o rutas relativas.

---

## Comandos Útiles

### Ver logs en Railway

```bash
railway logs
```

### Redeployar manualmente

```bash
railway up
```

### Ejecutar comando en Railway

```bash
railway run node server.js
```

---

## Costos y Límites (Railway Free Tier)

- ✅ **500 horas de ejecución por mes** (suficiente si no es 24/7)
- ✅ **1 GB de RAM**
- ✅ **1 GB de disco para MySQL**
- ✅ **100 GB de transferencia**

**Para que dure todo el mes:**
- La app dormirá después de inactividad
- Se despierta automáticamente al recibir una petición (tarda ~10 segundos la primera vez)

---

## Próximos Pasos (Opcional)

### Dominio Personalizado

1. Compra un dominio (ejemplo: `inmobiliariatarditto.com`)
2. En Railway → Settings → Custom Domains
3. Agrega tu dominio
4. Configura los DNS según las instrucciones de Railway

### Monitoreo

Railway incluye métricas básicas:
- CPU usage
- Memory usage
- Network traffic
- Logs en tiempo real

---

## Checklist Final

Antes de considerar el deploy completo, verifica:

- [ ] Código subido a GitHub
- [ ] Proyecto creado en Railway
- [ ] MySQL configurado y conectado
- [ ] Variables de entorno configuradas
- [ ] Base de datos importada con tablas y datos
- [ ] URL pública generada
- [ ] `main.js` actualizado con URL de producción
- [ ] Sitio accesible desde internet
- [ ] API responde correctamente
- [ ] Frontend carga propiedades dinámicamente
- [ ] Imágenes se visualizan correctamente
- [ ] Filtros funcionan
- [ ] Formularios envían a WhatsApp
- [ ] Página de detalle funciona
- [ ] Responsive en móvil

---

**¡Listo!** Tu sitio estará accesible desde cualquier dispositivo con internet en: `https://tu-app.up.railway.app`

**Tiempo estimado total:** 30-60 minutos (primera vez)

---

**Última actualización:** Noviembre 16, 2025  
**Versión de Railway:** Free Tier  
**Versión de Node.js recomendada:** 18.x o superior
