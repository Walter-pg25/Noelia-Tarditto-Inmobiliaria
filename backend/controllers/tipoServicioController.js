const pool = require('../config/database');

// Obtener todos los tipos de servicios
exports.obtenerTiposServicios = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [tipos] = await connection.query('SELECT * FROM tipo_servicio');
    connection.release();
    res.json(tipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener tipo de servicio por ID
exports.obtenerTipoServicioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [tipo] = await connection.query('SELECT * FROM tipo_servicio WHERE id_tipo = ?', [id]);
    connection.release();
    
    if (tipo.length === 0) {
      return res.status(404).json({ error: 'Tipo de servicio no encontrado' });
    }
    res.json(tipo[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo tipo de servicio
exports.crearTipoServicio = async (req, res) => {
  try {
    const { nombre, descripcion, precio_base } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO tipo_servicio (nombre, descripcion, precio_base) VALUES (?, ?, ?)',
      [nombre, descripcion, precio_base]
    );
    connection.release();
    
    res.status(201).json({ 
      id_tipo: result.insertId,
      ...req.body
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar tipo de servicio
exports.actualizarTipoServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio_base } = req.body;
    
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE tipo_servicio SET nombre = ?, descripcion = ?, precio_base = ? WHERE id_tipo = ?',
      [nombre, descripcion, precio_base, id]
    );
    connection.release();
    
    res.json({ mensaje: 'Tipo de servicio actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar tipo de servicio
exports.eliminarTipoServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM tipo_servicio WHERE id_tipo = ?', [id]);
    connection.release();
    
    res.json({ mensaje: 'Tipo de servicio eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
