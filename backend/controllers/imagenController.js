const pool = require('../config/database');
const path = require('path');
const fs = require('fs');

// Crear directorio de uploads si no existe
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Obtener todas las imágenes de una propiedad
exports.obtenerImagenesPorPropiedad = async (req, res) => {
  try {
    const { id_prop } = req.params;
    const connection = await pool.getConnection();
    const [imagenes] = await connection.query(
      'SELECT * FROM imagen_propiedad WHERE id_prop = ? ORDER BY orden ASC',
      [id_prop]
    );
    connection.release();
    res.json(imagenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener imagen por ID
exports.obtenerImagenPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [imagen] = await connection.query(
      'SELECT * FROM imagen_propiedad WHERE id = ?',
      [id]
    );
    connection.release();

    if (imagen.length === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }
    res.json(imagen[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Subir nueva imagen (sin multer por ahora, solo URL)
exports.crearImagen = async (req, res) => {
  try {
    const { id_prop, url, descripcion, orden } = req.body;

    if (!id_prop || !url) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (id_prop, url)' });
    }

    const connection = await pool.getConnection();

    // Verifica que la propiedad existe
    const [prop] = await connection.query(
      'SELECT id_prop FROM propiedad WHERE id_prop = ?',
      [id_prop]
    );

    if (prop.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    // Inserta la imagen
    const [result] = await connection.query(
      'INSERT INTO imagen_propiedad (id_prop, url, descripcion, orden) VALUES (?, ?, ?, ?)',
      [id_prop, url, descripcion || null, orden || 0]
    );
    connection.release();

    res.status(201).json({
      id: result.insertId,
      id_prop,
      url,
      descripcion,
      orden: orden || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar imagen
exports.actualizarImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, descripcion, orden } = req.body;

    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE imagen_propiedad SET url = ?, descripcion = ?, orden = ? WHERE id = ?',
      [url, descripcion || null, orden || 0, id]
    );
    connection.release();

    res.json({ mensaje: 'Imagen actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar imagen
exports.eliminarImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM imagen_propiedad WHERE id = ?', [id]);
    connection.release();

    res.json({ mensaje: 'Imagen eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
