-- Ejemplo: insertar imágenes para propiedades existentes
-- Ajusta `id_prop` según tu tabla `propiedad` y las rutas de las imágenes en tu proyecto.

INSERT INTO imagen_propiedad (id_prop, url, descripcion, orden) VALUES
(1, '../img/Propiedades/Alquiler/IMG_6570.jpg', 'Imagen principal propiedad 1', 0),
(1, '../img/Propiedades/Alquiler/IMG_6582.jpg', 'Fachada', 1),
(1, '../img/Propiedades/Alquiler/IMG_6587.jpg', 'Sala', 2),

(2, '../img/Propiedades/Alquiler/IMG_6591.jpg', 'Imagen principal propiedad 2', 0),
(2, '../img/Propiedades/Alquiler/IMG_6592.jpg', 'Cocina', 1),

(3, '../img/Propiedades/Alquiler/IMG_6596.jpg', 'Imagen principal propiedad 3', 0),
(3, '../img/Propiedades/Alquiler/IMG_6573.jpg', 'Patio', 1),

(4, '../img/Propiedades/Alquiler/IMG_6579.jpg', 'Imagen principal propiedad 4', 0),

(5, '../img/Propiedades/Alquiler/IMG_6570.jpg', 'Imagen principal propiedad 5', 0),

(6, '../img/Propiedades/Alquiler/IMG_6582.jpg', 'Imagen principal propiedad 6', 0);

-- Si quieres actualizar URLs que apunten al placeholder a una imagen válida:
-- UPDATE imagen_propiedad SET url = '../img/Propiedades/Alquiler/IMG_6570.jpg' WHERE url LIKE '%propiedad_placeholder_1.jpg';
