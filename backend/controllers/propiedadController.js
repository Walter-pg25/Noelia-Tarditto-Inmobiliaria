const pool = require('../config/database');

// Obtener todas las propiedades
exports.obtenerPropiedades = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [propiedades] = await connection.query('SELECT * FROM propiedad');
    connection.release();
    res.json(propiedades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener propiedad por ID
exports.obtenerPropiedadPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [propiedad] = await connection.query('SELECT * FROM propiedad WHERE id_prop = ?', [id]);
    connection.release();
    
    if (propiedad.length === 0) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    res.json(propiedad[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Crear nueva propiedad
exports.crearPropiedad = async (req, res) => {
  try {
    const { tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO propiedad (tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion]
    );
    connection.release();
    
    res.status(201).json({ 
      id_prop: result.insertId,
      ...req.body
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar propiedad
exports.actualizarPropiedad = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion } = req.body;
    
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE propiedad SET tipo = ?, ciudad = ?, calle = ?, num_casa = ?, sup_terreno = ?, sup_cubierta = ?, estado = ?, precio = ?, ambientes = ?, descripcion = ? WHERE id_prop = ?',
      [tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion, id]
    );
    connection.release();
    
    res.json({ mensaje: 'Propiedad actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar propiedad
exports.eliminarPropiedad = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM propiedad WHERE id_prop = ?', [id]);
    connection.release();
    
    res.json({ mensaje: 'Propiedad eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
