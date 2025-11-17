-- ============================================
-- SCRIPT PARA INSERTAR PROPIEDADES E IMÁGENES
-- ============================================
-- Instrucciones: 
-- 1. Abre TablePlus y conéctate a tu base de datos Railway
-- 2. Copia y pega este script completo
-- 3. Ejecuta el script
-- 4. Las propiedades aparecerán automáticamente en tu web
-- ============================================

-- PROPIEDADES EN VENTA
-- ============================================

-- Propiedad 1: Casa en Junín
INSERT INTO propiedad (titulo, descripcion, precio, tipo, estado, direccion, ciudad, metros_cuadrados, habitaciones, banos, tipo_servicio_id) 
VALUES (
    'Casa céntrica en Junín',
    'Excelente casa en zona céntrica de Junín. Cuenta con amplio living comedor, cocina equipada, 3 dormitorios con placard, 2 baños completos, patio con parrilla y garaje para 2 autos. A pocas cuadras de la plaza principal.',
    95000.00,
    'Casa',
    'Disponible',
    'Sarmiento 456',
    'Junín',
    150.00,
    3,
    2,
    1  -- tipo_servicio_id 1 = VENTA
);

-- Imágenes para Casa en Junín (usa URLs reales de imágenes de casas)
INSERT INTO imagen_propiedad (propiedad_id, url_imagen, es_principal, orden) VALUES 
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 1, 1),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 0, 2),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 0, 3);

-- Propiedad 2: Departamento en Lincoln
INSERT INTO propiedad (titulo, descripcion, precio, tipo, estado, direccion, ciudad, metros_cuadrados, habitaciones, banos, tipo_servicio_id) 
VALUES (
    'Departamento moderno en Lincoln',
    'Hermoso departamento de 2 ambientes en pleno centro de Lincoln. Totalmente amoblado, con cocina integrada, balcón con vista, baño completo y lavadero. Edificio con seguridad 24hs.',
    65000.00,
    'Departamento',
    'Disponible',
    'Av. Belgrano 789',
    'Lincoln',
    65.00,
    2,
    1,
    1  -- VENTA
);

INSERT INTO imagen_propiedad (propiedad_id, url_imagen, es_principal, orden) VALUES 
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 1, 1),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 0, 2),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 0, 3);

-- Propiedad 3: Local comercial en General Arenales
INSERT INTO propiedad (titulo, descripcion, precio, tipo, estado, direccion, ciudad, metros_cuadrados, habitaciones, banos, tipo_servicio_id) 
VALUES (
    'Local comercial sobre calle principal',
    'Amplio local comercial ubicado sobre calle principal de General Arenales. Gran vidriera, 2 baños, depósito y oficina. Ideal para cualquier tipo de comercio. Excelente ubicación y tránsito peatonal.',
    120000.00,
    'Local',
    'Disponible',
    'Mitre 234',
    'General Arenales',
    80.00,
    0,
    2,
    1  -- VENTA
);

INSERT INTO imagen_propiedad (propiedad_id, url_imagen, es_principal, orden) VALUES 
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800', 1, 1),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 0, 2);

-- Propiedad 4: Terreno en Vedia
INSERT INTO propiedad (titulo, descripcion, precio, tipo, estado, direccion, ciudad, metros_cuadrados, habitaciones, banos, tipo_servicio_id) 
VALUES (
    'Terreno esquinero en Vedia',
    'Excelente terreno en esquina de 300m2 en zona residencial de Vedia. Todos los servicios disponibles, ideal para construcción de vivienda. Muy buena ubicación.',
    35000.00,
    'Terreno',
    'Disponible',
    'Esquina 25 de Mayo y Alsina',
    'Vedia',
    300.00,
    0,
    0,
    1  -- VENTA
);

INSERT INTO imagen_propiedad (propiedad_id, url_imagen, es_principal, orden) VALUES 
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', 1, 1),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1513346940221-6f673d962e97?w=800', 0, 2);

-- PROPIEDADES EN ALQUILER
-- ============================================

-- Propiedad 5: Casa para alquiler en Chacabuco
INSERT INTO propiedad (titulo, descripcion, precio, tipo, estado, direccion, ciudad, metros_cuadrados, habitaciones, banos, tipo_servicio_id) 
VALUES (
    'Casa familiar en alquiler - Chacabuco',
    'Amplia casa de 4 ambientes en barrio tranquilo de Chacabuco. Living, comedor, cocina, 3 dormitorios, baño completo, patio con parrilla y cochera. Cerca de escuelas y comercios.',
    45000.00,
    'Casa',
    'Disponible',
    'Brown 567',
    'Chacabuco',
    110.00,
    3,
    1,
    2  -- tipo_servicio_id 2 = ALQUILER
);

INSERT INTO imagen_propiedad (propiedad_id, url_imagen, es_principal, orden) VALUES 
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800', 1, 1),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 0, 2),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 0, 3);

-- Propiedad 6: Departamento en alquiler en Junín
INSERT INTO propiedad (titulo, descripcion, precio, tipo, estado, direccion, ciudad, metros_cuadrados, habitaciones, banos, tipo_servicio_id) 
VALUES (
    'Monoambiente amoblado en Junín',
    'Cómodo monoambiente totalmente amoblado y equipado. Cocina integrada, baño completo, aire acondicionado. Ideal para estudiantes o profesionales. Incluye expensas.',
    28000.00,
    'Departamento',
    'Disponible',
    'Rivadavia 1234',
    'Junín',
    35.00,
    1,
    1,
    2  -- ALQUILER
);

INSERT INTO imagen_propiedad (propiedad_id, url_imagen, es_principal, orden) VALUES 
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800', 1, 1),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800', 0, 2);

-- Propiedad 7: Casa en alquiler en Lincoln
INSERT INTO propiedad (titulo, descripcion, precio, tipo, estado, direccion, ciudad, metros_cuadrados, habitaciones, banos, tipo_servicio_id) 
VALUES (
    'Casa moderna en alquiler - Lincoln',
    'Hermosa casa a estrenar en barrio privado de Lincoln. 3 dormitorios con placard, 2 baños, living-comedor amplio, cocina moderna, quincho con parrilla, pileta y garage doble.',
    85000.00,
    'Casa',
    'Disponible',
    'Country Las Acacias lote 45',
    'Lincoln',
    180.00,
    3,
    2,
    2  -- ALQUILER
);

INSERT INTO imagen_propiedad (propiedad_id, url_imagen, es_principal, orden) VALUES 
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 1, 1),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800', 0, 2),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', 0, 3),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800', 0, 4);

-- Propiedad 8: Local en alquiler en General Arenales
INSERT INTO propiedad (titulo, descripcion, precio, tipo, estado, direccion, ciudad, metros_cuadrados, habitaciones, banos, tipo_servicio_id) 
VALUES (
    'Local céntrico en alquiler - General Arenales',
    'Local comercial en pleno centro de General Arenales. Dos plantas, amplia vidriera, baño, depósito. Excelente ubicación sobre peatonal. Ideal para indumentaria, perfumería o cualquier rubro comercial.',
    55000.00,
    'Local',
    'Disponible',
    'Peatonal San Martín 345',
    'General Arenales',
    60.00,
    0,
    1,
    2  -- ALQUILER
);

INSERT INTO imagen_propiedad (propiedad_id, url_imagen, es_principal, orden) VALUES 
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', 1, 1),
(LAST_INSERT_ID(), 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800', 0, 2);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecuta estas consultas para verificar que todo se insertó correctamente:

-- Ver todas las propiedades insertadas
SELECT p.id, p.titulo, p.ciudad, p.precio, ts.nombre as tipo_servicio
FROM propiedad p
JOIN tipo_servicio ts ON p.tipo_servicio_id = ts.id
ORDER BY p.id DESC;

-- Ver cuántas imágenes tiene cada propiedad
SELECT p.id, p.titulo, COUNT(i.id) as cantidad_imagenes
FROM propiedad p
LEFT JOIN imagen_propiedad i ON p.id = i.propiedad_id
GROUP BY p.id
ORDER BY p.id DESC;

-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
-- 1. Las URLs de imágenes son de Unsplash (banco de imágenes gratuito)
-- 2. Puedes reemplazar estas URLs con tus propias imágenes
-- 3. Para usar tus propias imágenes, súbelas a:
--    - Imgur: https://imgur.com
--    - Cloudinary: https://cloudinary.com
--    - Cualquier hosting de imágenes
-- 4. Las propiedades aparecerán automáticamente en tu web
-- 5. Los filtros funcionarán automáticamente por ciudad, tipo y estado
