const express = require('express');
const router = express.Router();
const propiedadController = require('../controllers/propiedadController');

router.get('/', propiedadController.obtenerPropiedades);
router.get('/:id', propiedadController.obtenerPropiedadPorId);
router.post('/', propiedadController.crearPropiedad);
router.put('/:id', propiedadController.actualizarPropiedad);
router.delete('/:id', propiedadController.eliminarPropiedad);

module.exports = router;
