const pool = require('../config/database');

// Obtener todos los servicios
exports.obtenerServicios = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [servicios] = await connection.query('SELECT * FROM servicio');
    connection.release();
    res.json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener servicio por ID
exports.obtenerServicioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [servicio] = await connection.query('SELECT * FROM servicio WHERE id_serv = ?', [id]);
    connection.release();
    
    if (servicio.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(servicio[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo servicio
exports.crearServicio = async (req, res) => {
  try {
    const { fecha_inicio, estado, id_tipo, id_cl, id_emp, id_prop } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO servicio (fecha_inicio, estado, id_tipo, id_cl, id_emp, id_prop) VALUES (?, ?, ?, ?, ?, ?)',
      [fecha_inicio, estado, id_tipo, id_cl, id_emp, id_prop]
    );
    connection.release();
    
    res.status(201).json({ 
      id_serv: result.insertId,
      ...req.body
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar servicio
exports.actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_inicio, estado, id_tipo, id_cl, id_emp, id_prop } = req.body;
    
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE servicio SET fecha_inicio = ?, estado = ?, id_tipo = ?, id_cl = ?, id_emp = ?, id_prop = ? WHERE id_serv = ?',
      [fecha_inicio, estado, id_tipo, id_cl, id_emp, id_prop, id]
    );
    connection.release();
    
    res.json({ mensaje: 'Servicio actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar servicio
exports.eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM servicio WHERE id_serv = ?', [id]);
    connection.release();
    
    res.json({ mensaje: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
