const pool = require('../config/database');

// Obtener todos los empleados
exports.obtenerEmpleados = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [empleados] = await connection.query('SELECT * FROM empleado');
    connection.release();
    res.json(empleados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener empleado por ID
exports.obtenerEmpleadoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [empleado] = await connection.query('SELECT * FROM empleado WHERE id_emp = ?', [id]);
    connection.release();
    
    if (empleado.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json(empleado[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo empleado
exports.crearEmpleado = async (req, res) => {
  try {
    const { nombre, apellido, cargo, email, telefono, ciudad, calle, num_casa } = req.body;
    
    if (!nombre || !apellido || !email || !telefono) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO empleado (nombre, apellido, cargo, email, telefono, ciudad, calle, num_casa) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, cargo, email, telefono, ciudad, calle, num_casa]
    );
    connection.release();
    
    res.status(201).json({ 
      id_emp: result.insertId,
      ...req.body
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar empleado
exports.actualizarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, cargo, email, telefono, ciudad, calle, num_casa } = req.body;
    
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE empleado SET nombre = ?, apellido = ?, cargo = ?, email = ?, telefono = ?, ciudad = ?, calle = ?, num_casa = ? WHERE id_emp = ?',
      [nombre, apellido, cargo, email, telefono, ciudad, calle, num_casa, id]
    );
    connection.release();
    
    res.json({ mensaje: 'Empleado actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar empleado
exports.eliminarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM empleado WHERE id_emp = ?', [id]);
    connection.release();
    
    res.json({ mensaje: 'Empleado eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
