const pool = require('../config/database');

// Obtener todas las solicitudes
exports.obtenerSolicitudes = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [solicitudes] = await connection.query('SELECT * FROM solicitud');
    connection.release();
    res.json(solicitudes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener solicitud por ID
exports.obtenerSolicitudPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [solicitud] = await connection.query('SELECT * FROM solicitud WHERE id = ?', [id]);
    connection.release();
    
    if (solicitud.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json(solicitud[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Crear nueva solicitud
exports.crearSolicitud = async (req, res) => {
  try {
    const { estado, comentarios, fecha, id_serv, id_cl } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO solicitud (estado, comentarios, fecha, id_serv, id_cl) VALUES (?, ?, ?, ?, ?)',
      [estado, comentarios, fecha || new Date(), id_serv, id_cl]
    );
    connection.release();
    
    res.status(201).json({ 
      id: result.insertId,
      ...req.body
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar solicitud
exports.actualizarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, comentarios, fecha, id_serv, id_cl } = req.body;
    
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE solicitud SET estado = ?, comentarios = ?, fecha = ?, id_serv = ?, id_cl = ? WHERE id = ?',
      [estado, comentarios, fecha, id_serv, id_cl, id]
    );
    connection.release();
    
    res.json({ mensaje: 'Solicitud actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar solicitud
exports.eliminarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM solicitud WHERE id = ?', [id]);
    connection.release();
    
    res.json({ mensaje: 'Solicitud eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
