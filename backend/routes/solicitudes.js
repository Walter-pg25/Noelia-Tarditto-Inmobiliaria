const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');

router.get('/', solicitudController.obtenerSolicitudes);
router.get('/:id', solicitudController.obtenerSolicitudPorId);
router.post('/', solicitudController.crearSolicitud);
router.put('/:id', solicitudController.actualizarSolicitud);
router.delete('/:id', solicitudController.eliminarSolicitud);

module.exports = router;
