const express = require('express');
const router = express.Router();
const imagenController = require('../controllers/imagenController');

// Obtener todas las imágenes de una propiedad
router.get('/propiedad/:id_prop', imagenController.obtenerImagenesPorPropiedad);

// Obtener imagen por ID
router.get('/:id', imagenController.obtenerImagenPorId);

// Crear nueva imagen
router.post('/', imagenController.crearImagen);

// Actualizar imagen
router.put('/:id', imagenController.actualizarImagen);

// Eliminar imagen
router.delete('/:id', imagenController.eliminarImagen);

module.exports = router;
