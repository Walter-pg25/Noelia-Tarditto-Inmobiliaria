-- ==============================================
-- SCHEMA COMPLETO - INMOBILIARIA TARDITTO
-- Para importar a Railway MySQL
-- ==============================================

-- Crear base de datos (Railway ya tiene la BD 'railway' creada)
USE railway;

-- ==============================================
-- 1. TABLA: propiedad
-- ==============================================
CREATE TABLE IF NOT EXISTS `propiedad` (
  `id_prop` INT AUTO_INCREMENT PRIMARY KEY,
  `tipo` ENUM('casa', 'departamento', 'local comercial', 'monoambiente', 'duplex') NOT NULL,
  `ciudad` VARCHAR(100),
  `calle` VARCHAR(100),
  `num_casa` VARCHAR(10),
  `sup_terreno` DECIMAL(10,2),
  `sup_cubierta` DECIMAL(10,2),
  `estado` ENUM('alquilada', 'desocupada', 'comprada') NOT NULL,
  `precio` DECIMAL(10,2),
  `ambientes` VARCHAR(255),
  `descripcion` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==============================================
-- 2. TABLA: imagen_propiedad
-- ==============================================
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

-- ==============================================
-- 3. TABLA: cliente
-- ==============================================
CREATE TABLE IF NOT EXISTS `cliente` (
  `id_cl` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `dni` VARCHAR(20) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==============================================
-- 4. TABLA: empleado
-- ==============================================
CREATE TABLE IF NOT EXISTS `empleado` (
  `id_emp` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `cargo` VARCHAR(100),
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `telefono` VARCHAR(20) NOT NULL,
  `ciudad` VARCHAR(100),
  `calle` VARCHAR(100),
  `num_casa` VARCHAR(10),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==============================================
-- 5. TABLA: tipo_servicio
-- ==============================================
CREATE TABLE IF NOT EXISTS `tipo_servicio` (
  `id_tipo` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT,
  `precio_base` DECIMAL(10,2),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==============================================
-- 6. TABLA: servicio
-- ==============================================
CREATE TABLE IF NOT EXISTS `servicio` (
  `id_serv` INT AUTO_INCREMENT PRIMARY KEY,
  `fecha_inicio` DATE NOT NULL,
  `estado` ENUM('pendiente', 'en_proceso', 'completado', 'cancelado') DEFAULT 'pendiente',
  `id_tipo` INT NOT NULL,
  `id_cl` INT NOT NULL,
  `id_emp` INT,
  `id_prop` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_tipo`) REFERENCES `tipo_servicio`(`id_tipo`) ON DELETE RESTRICT,
  FOREIGN KEY (`id_cl`) REFERENCES `cliente`(`id_cl`) ON DELETE RESTRICT,
  FOREIGN KEY (`id_emp`) REFERENCES `empleado`(`id_emp`) ON DELETE SET NULL,
  FOREIGN KEY (`id_prop`) REFERENCES `propiedad`(`id_prop`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==============================================
-- 7. TABLA: solicitud
-- ==============================================
CREATE TABLE IF NOT EXISTS `solicitud` (
  `id_sol` INT AUTO_INCREMENT PRIMARY KEY,
  `estado` ENUM('nueva', 'en_revision', 'aprobada', 'rechazada') DEFAULT 'nueva',
  `comentarios` TEXT,
  `fecha` DATE NOT NULL,
  `id_serv` INT,
  `id_cl` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_serv`) REFERENCES `servicio`(`id_serv`) ON DELETE SET NULL,
  FOREIGN KEY (`id_cl`) REFERENCES `cliente`(`id_cl`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==============================================
-- DATOS DE PRUEBA
-- ==============================================

-- Insertar propiedades de ejemplo
INSERT INTO `propiedad` (`tipo`, `ciudad`, `calle`, `num_casa`, `sup_terreno`, `sup_cubierta`, `estado`, `precio`, `ambientes`, `descripcion`) VALUES
('casa', 'Rivadavia', 'Calle Libertad', '150', 250.00, 180.00, 'desocupada', 350000.00, '3 habitaciones, 2 baños', 'Casa familiar en excelente ubicación'),
('departamento', 'San Martin', 'Av. San Martín', '500', 120.00, 95.00, 'desocupada', 180000.00, '2 habitaciones, 1 baño', 'Departamento moderno en zona céntrica'),
('casa', 'Chacabuco', 'Calle Belgrano', '320', 300.00, 220.00, 'alquilada', 450000.00, '4 habitaciones, 3 baños', 'Casa amplia con jardín y parrilla');

-- Insertar imágenes de ejemplo (ajusta las URLs a tus imágenes reales)
INSERT INTO `imagen_propiedad` (`id_prop`, `url`, `descripcion`, `orden`) VALUES
(1, '../img/Propiedades/Alquiler/IMG_6570.jpg', 'Fachada principal', 0),
(1, '../img/Propiedades/Alquiler/IMG_6582.jpg', 'Living comedor', 1),
(1, '../img/Propiedades/Alquiler/IMG_6587.jpg', 'Cocina', 2),
(2, '../img/Propiedades/Alquiler/IMG_6570.jpg', 'Vista exterior', 0),
(3, '../img/Propiedades/Alquiler/IMG_6570.jpg', 'Frente de la propiedad', 0);

-- Insertar tipos de servicio
INSERT INTO `tipo_servicio` (`nombre`, `descripcion`, `precio_base`) VALUES
('Alquiler', 'Servicio de alquiler de propiedades', 5000.00),
('Venta', 'Servicio de venta de propiedades', 15000.00),
('Tasación', 'Servicio de tasación de propiedades', 3000.00);

-- ==============================================
-- FIN DEL SCHEMA
-- ==============================================
