-- Crear tabla imagen_propiedad
CREATE TABLE IF NOT EXISTS `imagen_propiedad` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_prop` INT NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `descripcion` VARCHAR(255) DEFAULT NULL,
  `orden` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_prop`) REFERENCES `propiedad`(`id_prop`) ON DELETE CASCADE,
  INDEX (`id_prop`, `orden`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Ejemplos de inserción (comentados para que hagas INSERT manual o ejecutes el script)
-- Primero inserta propiedades en tabla `propiedad`, luego inserta imágenes:
/*
INSERT INTO `imagen_propiedad` (`id_prop`, `url`, `descripcion`, `orden`) VALUES
(1, '../img/Propiedades/Alquiler/IMG_6570.jpg', 'Imagen principal', 0),
(1, '../img/Propiedades/Alquiler/IMG_6582.jpg', 'Fachada', 1),
(1, '../img/Propiedades/Alquiler/IMG_6587.jpg', 'Sala', 2),
(1, '../img/Propiedades/Alquiler/IMG_6591.jpg', 'Cocina', 3),
(2, '../img/propiedad_placeholder_1.jpg', 'Departamento', 0),
(3, '../img/propiedad_placeholder_1.jpg', 'Casa', 0);
*/
