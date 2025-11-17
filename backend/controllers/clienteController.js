const pool = require('../config/database');

// Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [clientes] = await connection.query('SELECT * FROM cliente');
    connection.release();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener cliente por ID
exports.obtenerClientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [cliente] = await connection.query('SELECT * FROM cliente WHERE id_cl = ?', [id]);
    connection.release();
    
    if (cliente.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo cliente
exports.crearCliente = async (req, res) => {
  try {
    const { nombre, apellido, email, dni } = req.body;
    
    if (!nombre || !apellido || !email || !dni) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO cliente (nombre, apellido, email, dni) VALUES (?, ?, ?, ?)',
      [nombre, apellido, email, dni]
    );
    connection.release();
    
    res.status(201).json({ 
      id_cl: result.insertId,
      nombre,
      apellido,
      email,
      dni
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cliente
exports.actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, dni } = req.body;
    
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE cliente SET nombre = ?, apellido = ?, email = ?, dni = ? WHERE id_cl = ?',
      [nombre, apellido, email, dni, id]
    );
    connection.release();
    
    res.json({ mensaje: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar cliente
exports.eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM cliente WHERE id_cl = ?', [id]);
    connection.release();
    
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
