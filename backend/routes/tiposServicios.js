const express = require('express');
const router = express.Router();
const tipoServicioController = require('../controllers/tipoServicioController');

router.get('/', tipoServicioController.obtenerTiposServicios);
router.get('/:id', tipoServicioController.obtenerTipoServicioPorId);
router.post('/', tipoServicioController.crearTipoServicio);
router.put('/:id', tipoServicioController.actualizarTipoServicio);
router.delete('/:id', tipoServicioController.eliminarTipoServicio);

module.exports = router;
