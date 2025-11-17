-- ============================================
-- SCRIPT CORRECTO PARA TU ESTRUCTURA DE BD
-- ============================================
-- Este script coincide con la estructura real de tu tabla 'propiedad'
-- ============================================

-- PROPIEDADES EN VENTA (estado: 'desocupada')
-- ============================================

-- Propiedad 1: Casa en Junín
INSERT INTO propiedad (tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion) 
VALUES (
    'casa',
    'Junín',
    'Sarmiento',
    '456',
    150.00,
    120.00,
    'desocupada',
    95000.00,
    '3 dormitorios, 2 baños, living-comedor, cocina',
    'Excelente casa en zona céntrica de Junín. Cuenta con amplio living comedor, cocina equipada, 3 dormitorios con placard, 2 baños completos, patio con parrilla y garaje para 2 autos. A pocas cuadras de la plaza principal.'
);

-- Obtener el ID de la última propiedad insertada
SET @last_id = LAST_INSERT_ID();

-- Insertar imágenes para esta propiedad
INSERT INTO imagen_propiedad (id_prop, url, descripcion, orden) VALUES 
(@last_id, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'Frente de la casa', 1),
(@last_id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'Living comedor', 2),
(@last_id, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'Cocina', 3);

-- Propiedad 2: Departamento en Lincoln
INSERT INTO propiedad (tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion) 
VALUES (
    'departamento',
    'Lincoln',
    'Av. Belgrano',
    '789',
    NULL,
    65.00,
    'desocupada',
    65000.00,
    '2 ambientes, 1 baño, cocina integrada',
    'Hermoso departamento de 2 ambientes en pleno centro de Lincoln. Totalmente amoblado, con cocina integrada, balcón con vista, baño completo y lavadero. Edificio con seguridad 24hs.'
);

SET @last_id = LAST_INSERT_ID();

INSERT INTO imagen_propiedad (id_prop, url, descripcion, orden) VALUES 
(@last_id, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'Vista del departamento', 1),
(@last_id, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'Living', 2),
(@last_id, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'Cocina integrada', 3);

-- Propiedad 3: Local comercial en General Arenales
INSERT INTO propiedad (tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion) 
VALUES (
    'local comercial',
    'General Arenales',
    'Mitre',
    '234',
    NULL,
    80.00,
    'desocupada',
    120000.00,
    '2 plantas, baños, depósito',
    'Amplio local comercial ubicado sobre calle principal de General Arenales. Gran vidriera, 2 baños, depósito y oficina. Ideal para cualquier tipo de comercio. Excelente ubicación y tránsito peatonal.'
);

SET @last_id = LAST_INSERT_ID();

INSERT INTO imagen_propiedad (id_prop, url, descripcion, orden) VALUES 
(@last_id, 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800', 'Frente del local', 1),
(@last_id, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'Interior', 2);

-- Propiedad 4: Casa en Chacabuco
INSERT INTO propiedad (tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion) 
VALUES (
    'casa',
    'Chacabuco',
    'Brown',
    '567',
    200.00,
    110.00,
    'desocupada',
    78000.00,
    '3 dormitorios, 1 baño, patio',
    'Amplia casa de 4 ambientes en barrio tranquilo de Chacabuco. Living, comedor, cocina, 3 dormitorios, baño completo, patio con parrilla y cochera. Cerca de escuelas y comercios.'
);

SET @last_id = LAST_INSERT_ID();

INSERT INTO imagen_propiedad (id_prop, url, descripcion, orden) VALUES 
(@last_id, 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800', 'Frente', 1),
(@last_id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Patio', 2),
(@last_id, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'Interior', 3);

-- PROPIEDADES PARA ALQUILER (estado: 'alquilada' o 'desocupada')
-- ============================================

-- Propiedad 5: Monoambiente en Junín
INSERT INTO propiedad (tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion) 
VALUES (
    'monoambiente',
    'Junín',
    'Rivadavia',
    '1234',
    NULL,
    35.00,
    'desocupada',
    28000.00,
    '1 ambiente, baño, cocina integrada',
    'Cómodo monoambiente totalmente amoblado y equipado. Cocina integrada, baño completo, aire acondicionado. Ideal para estudiantes o profesionales. Incluye expensas.'
);

SET @last_id = LAST_INSERT_ID();

INSERT INTO imagen_propiedad (id_prop, url, descripcion, orden) VALUES 
(@last_id, 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800', 'Vista general', 1),
(@last_id, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800', 'Cocina', 2);

-- Propiedad 6: Duplex en Lincoln
INSERT INTO propiedad (tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion) 
VALUES (
    'duplex',
    'Lincoln',
    'Country Las Acacias',
    '45',
    250.00,
    180.00,
    'desocupada',
    85000.00,
    '3 dormitorios, 2 baños, quincho',
    'Hermoso duplex a estrenar en barrio privado de Lincoln. 3 dormitorios con placard, 2 baños, living-comedor amplio, cocina moderna, quincho con parrilla, pileta y garage doble.'
);

SET @last_id = LAST_INSERT_ID();

INSERT INTO imagen_propiedad (id_prop, url, descripcion, orden) VALUES 
(@last_id, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 'Frente', 1),
(@last_id, 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800', 'Living', 2),
(@last_id, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', 'Quincho', 3),
(@last_id, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800', 'Pileta', 4);

-- Propiedad 7: Local en General Arenales
INSERT INTO propiedad (tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion) 
VALUES (
    'local comercial',
    'General Arenales',
    'Peatonal San Martín',
    '345',
    NULL,
    60.00,
    'desocupada',
    55000.00,
    '2 plantas, vidriera, depósito',
    'Local comercial en pleno centro de General Arenales. Dos plantas, amplia vidriera, baño, depósito. Excelente ubicación sobre peatonal. Ideal para indumentaria, perfumería o cualquier rubro comercial.'
);

SET @last_id = LAST_INSERT_ID();

INSERT INTO imagen_propiedad (id_prop, url, descripcion, orden) VALUES 
(@last_id, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', 'Frente', 1),
(@last_id, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800', 'Interior', 2);

-- Propiedad 8: Departamento en Vedia
INSERT INTO propiedad (tipo, ciudad, calle, num_casa, sup_terreno, sup_cubierta, estado, precio, ambientes, descripcion) 
VALUES (
    'departamento',
    'Vedia',
    '25 de Mayo',
    '890',
    NULL,
    55.00,
    'desocupada',
    42000.00,
    '2 dormitorios, 1 baño, balcón',
    'Departamento de 2 dormitorios en el centro de Vedia. Living comedor, cocina separada, balcón al frente, baño completo. Muy luminoso y bien ubicado.'
);

SET @last_id = LAST_INSERT_ID();

INSERT INTO imagen_propiedad (id_prop, url, descripcion, orden) VALUES 
(@last_id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'Balcón', 1),
(@last_id, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'Living', 2);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver todas las propiedades
SELECT id_prop, tipo, ciudad, CONCAT(calle, ' ', num_casa) as direccion, precio, estado
FROM propiedad
ORDER BY id_prop DESC;

-- Ver cuántas imágenes tiene cada propiedad
SELECT p.id_prop, CONCAT(p.tipo, ' en ', p.ciudad) as propiedad, COUNT(i.id) as cantidad_imagenes
FROM propiedad p
LEFT JOIN imagen_propiedad i ON p.id_prop = i.id_prop
GROUP BY p.id_prop
ORDER BY p.id_prop DESC;

-- ============================================
-- NOTAS
-- ============================================
-- 1. Todas las propiedades tienen estado 'desocupada' (disponibles)
-- 2. Para diferenciar venta/alquiler en tu frontend, deberás:
--    - Filtrar por rango de precios
--    - O agregar una columna 'tipo_operacion' a la tabla
-- 3. Las imágenes son de Unsplash (gratuitas)
