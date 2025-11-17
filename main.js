document.addEventListener('DOMContentLoaded', () => {
    // Configuración de API URL según entorno
    const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001' 
        : 'https://responsible-possibility-production.up.railway.app';

    // Menú desplegable
    const botonMenu = document.getElementById('boton-menu');
    const menuDesplegable = document.getElementById('menu-desplegable');
    const logoLink = document.getElementById('logo-link');

    function alternarMenu() {
        menuDesplegable.classList.toggle('menu-activo');
    }

    if (botonMenu && menuDesplegable) {
        botonMenu.addEventListener('click', alternarMenu);
    }

    // Navegación del logo
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            menuDesplegable.classList.remove('menu-activo');
        });
    }

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                menuDesplegable.classList.remove('menu-activo');
            }
        });
    });

    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ACORDEÓN DE PREGUNTAS FRECUENTES
    const preguntasAcordeon = document.querySelectorAll('.pregunta-acordeon');

    if (preguntasAcordeon.length > 0) {
        preguntasAcordeon.forEach((pregunta) => {
            const header = pregunta.querySelector('.pregunta-header');
            
            if (header) {
                header.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Verificar si esta pregunta ya está activa
                    const estaActiva = pregunta.classList.contains('activo');
                    
                    // Cerrar todas las preguntas
                    preguntasAcordeon.forEach(p => {
                        p.classList.remove('activo');
                    });
                    
                    // Si no estaba activa, abrirla
                    if (!estaActiva) {
                        pregunta.classList.add('activo');
                        
                        // Scroll suave hacia la pregunta después de un pequeño delay
                        setTimeout(() => {
                            const yOffset = -100;
                            const y = pregunta.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            
                            window.scrollTo({
                                top: y,
                                behavior: 'smooth'
                            });
                        }, 300);
                    }
                });
            }
        });
    }

    // FORMULARIO DE CONTACTO DE LA PÁGINA PRINCIPAL
    const formularioPrincipal = document.querySelector('.formulario1 form');
    if (formularioPrincipal && window.location.pathname.includes('Principal')) {
        formularioPrincipal.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = this.querySelector('input[type="text"]').value;
            const telefono = this.querySelector('input[type="tel"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const mensaje = this.querySelector('textarea').value;

            let mensajeWhatsApp = ` *Consulta General desde la Web*%0A%0A`;
            mensajeWhatsApp += ` *Nombre:* ${nombre}%0A`;
            mensajeWhatsApp += ` *Teléfono:* ${telefono}%0A`;
            mensajeWhatsApp += ` *Email:* ${email}%0A%0A`;
            mensajeWhatsApp += ` *Mensaje:*%0A${encodeURIComponent(mensaje)}`;

            const numeroWhatsApp = '5492634715111';
            window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`, '_blank');
            this.reset();
            alert('¡Gracias por tu consulta! Te redirigimos a WhatsApp para continuar la conversación.');
        });
    }

    /* SISTEMA DE NAVEGACIÓN A DETALLE */
    const propiedadesGrid = document.getElementById('propiedades-grid');

    // Renderiza tarjetas de propiedades a partir de datos (array)
    function formatPrice(num) {
        if (!num && num !== 0) return '$0';
        return '$' + Number(num).toLocaleString('es-AR');
    }

    function renderPropiedades(propiedades) {
        if (!propiedadesGrid) return;
        if (!Array.isArray(propiedades) || propiedades.length === 0) return;

        // Construir set de ubicaciones únicas para el filtro dinámico
        const ubicacionesSet = new Set();

        const html = propiedades.map((p, index) => {
            const tipo = p.tipo || 'casa';
            const ciudad = p.ciudad || p.ubicacion || 'Rivadavia';
            // Nombre amigable: descripción truncada o fallback "Tipo en alquiler/venta en Ciudad"
            const estadoRaw = (p.estado || '').toString();
            const estadoNorm = formatearTagEstado(estadoRaw);
            const nombre = p.descripcion && p.descripcion.trim().length > 0
                ? (p.descripcion.length > 50 ? p.descripcion.slice(0, 50) + '...' : p.descripcion)
                : `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${estadoNorm} en ${ciudad}`;
            const caracteristicas = p.ambientes || '';
            const superficie = p.sup_terreno || p.sup_cubierta || 0;
            const precio = p.precio || 0;
            const estado = estadoNorm;
            const habitaciones = (p.ambientes && typeof p.ambientes === 'string') ? (p.ambientes.match(/(\d+)/) ? p.ambientes.match(/(\d+)/)[0] : '0') : '0';
            const propiedadId = p.id_prop || index;

            ubicacionesSet.add(ciudad.trim());

            return `
                <div class="propiedad-card" data-id-prop="${propiedadId}" data-tipo="${tipo}" data-ubicacion="${ciudad.toLowerCase()}" data-precio="${precio}" data-hab="${habitaciones}" data-superficie="${superficie}" data-estado="${inferOperacion(estadoRaw)}">
                    <div class="propiedad-imagen-contenedor">
                        <span class="propiedad-tag">${estado}</span>
                        <img src="${resolveAssetPath('img/propiedad_placeholder_1.jpg')}" alt="${nombre}" class="propiedad-imagen" data-prop-id="${propiedadId}">
                    </div>
                    <div class="propiedad-info">
                        <h3 class="propiedad-nombre">${nombre}</h3>
                        <p class="propiedad-caracteristicas">${caracteristicas}</p>
                        <p class="propiedad-descripcion">${p.descripcion ? p.descripcion : ''}</p>
                        <p class="propiedad-caracteristicas">Superficie: ${superficie} m² - ${ciudad}</p>
                        <div class="propiedad-footer">
                            <p class="propiedad-precio">${formatPrice(precio)}</p>
                            <a href="Detalle-propiedad.html" class="propiedad-boton">Detalles</a>
                        </div>
                    </div>
                </div>`;
        }).join('');

        // Reemplaza sólo si hay resultados
        propiedadesGrid.innerHTML = html;

        // Actualizar dinámicamente el select de ubicaciones si existe
        const selectUbicacion = document.getElementById('ubicacion');
        if (selectUbicacion) {
            const valorAnterior = selectUbicacion.value;
            // Mantener opción por defecto (primera) y limpiar el resto
            const primeraOpcion = selectUbicacion.querySelector('option[value=""]') || null;
            selectUbicacion.innerHTML = '';
            if (primeraOpcion) {
                selectUbicacion.appendChild(primeraOpcion);
            } else {
                const optDefault = document.createElement('option');
                optDefault.value = '';
                optDefault.textContent = 'Todas';
                selectUbicacion.appendChild(optDefault);
            }

            Array.from(ubicacionesSet)
                .sort((a,b) => a.localeCompare(b, 'es'))
                .forEach(ciu => {
                    const opt = document.createElement('option');
                    opt.value = ciu; // se normaliza más tarde al filtrar
                    opt.textContent = ciu;
                    selectUbicacion.appendChild(opt);
                });

            // Restaurar selección previa si todavía existe
            if (valorAnterior && Array.from(selectUbicacion.options).some(o => o.value === valorAnterior)) {
                selectUbicacion.value = valorAnterior;
            }
        }

        // Cargar imágenes para cada propiedad desde la API
        propiedades.forEach((p) => {
            const propiedadId = p.id_prop;
            const imgElement = propiedadesGrid.querySelector(`img[data-prop-id="${propiedadId}"]`);
            
            if (imgElement) {
                // Fallback si la imagen final no carga
                imgElement.onerror = () => {
                    if (!imgElement.dataset.fallbackApplied) {
                        imgElement.dataset.fallbackApplied = 'true';
                        imgElement.src = resolveAssetPath('img/propiedad_placeholder_1.jpg');
                    }
                };
                fetch(`${API_URL}/api/imagenes/propiedad/${propiedadId}`)
                    .then(res => res.json())
                    .then(imagenes => {
                        if (imagenes && imagenes.length > 0) {
                            // Usar la primera imagen (orden 0)
                            const imagenPrincipal = imagenes.sort((a, b) => a.orden - b.orden)[0];
                            imgElement.src = resolveAssetPath(imagenPrincipal.url);
                        }
                    })
                    .catch(() => {});
            }
        });
    }

    // Inicializa listeners y comportamientos para las tarjetas recién renderizadas
    function initPropertyCards() {
        if (!propiedadesGrid) return;
        const tarjetas = propiedadesGrid.querySelectorAll('.propiedad-card');
        tarjetas.forEach((tarjeta, index) => {
            tarjeta.style.cursor = 'pointer';
            const propiedadId = tarjeta.getAttribute('data-id-prop') || `prop-${index + 1}`;
            tarjeta.setAttribute('data-id', propiedadId);

            tarjeta.addEventListener('click', (e) => {
                if (e.target.classList.contains('propiedad-boton') || e.target.closest('.propiedad-boton')) {
                    return;
                }

                const imagenesGaleria = [];
                const imagenPrincipal = tarjeta.querySelector('.propiedad-imagen')?.src;
                if (imagenPrincipal) imagenesGaleria.push(imagenPrincipal);

                let tipoOperacion = 'Venta';
                const pathname = window.location.pathname.toLowerCase();
                const tagTexto = tarjeta.querySelector('.propiedad-tag')?.textContent.toLowerCase() || '';

                if (pathname.includes('alquiler')) tipoOperacion = 'Alquiler';
                else if (pathname.includes('venta')) tipoOperacion = 'Venta';

                if (tagTexto.includes('alquiler')) tipoOperacion = 'Alquiler';
                else if (tagTexto.includes('venta')) tipoOperacion = 'Venta';

                const datosPropiedad = {
                    id: propiedadId,
                    id_prop: propiedadId,
                    nombre: tarjeta.querySelector('.propiedad-nombre')?.textContent || 'Propiedad',
                    tipo: tarjeta.getAttribute('data-tipo') || 'casa',
                    ubicacion: tarjeta.getAttribute('data-ubicacion') || 'Rivadavia',
                    precio: tarjeta.querySelector('.propiedad-precio')?.textContent || '$0',
                    caracteristicas: tarjeta.querySelector('.propiedad-caracteristicas')?.textContent || '',
                    imagenes: imagenesGaleria,
                    tag: tarjeta.querySelector('.propiedad-tag')?.textContent || 'EN VENTA',
                    habitaciones: tarjeta.getAttribute('data-hab') || '0',
                    superficie: tarjeta.getAttribute('data-superficie') || '0',
                    operacion: tipoOperacion,
                    video: null
                };

                localStorage.setItem('propiedadActual', JSON.stringify(datosPropiedad));
                window.location.href = `Detalle-Propiedad.html?id=${propiedadId}`;
            });
        });

        // Vuelve a ejecutar filtros después de inicializar tarjetas
        if (typeof filtrarPropiedades === 'function') filtrarPropiedades();
    }

    // Trae propiedades desde la API y renderiza
    async function fetchAndRenderPropiedades() {
        if (!propiedadesGrid) return;
        try {
            const res = await fetch(`${API_URL}/api/propiedades`);
            if (!res.ok) return;
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                // Filtrar por operación según la página (alquiler/venta) con mapeo desde enum
                const pathLower = window.location.pathname.toLowerCase();
                let filtradas = data;
                if (pathLower.includes('alquiler')) {
                    const tmp = data.filter(p => inferOperacion(p.estado) === 'alquiler');
                    if (tmp.length > 0) filtradas = tmp; // sólo usar si hay coincidencias
                } else if (pathLower.includes('venta')) {
                    const tmp = data.filter(p => inferOperacion(p.estado) === 'venta');
                    if (tmp.length > 0) filtradas = tmp;
                }
                renderPropiedades(filtradas);
                initPropertyCards();
            } else {
                // Si no hay datos del servidor, conserva las tarjetas estáticas ya en el HTML
                initPropertyCards();
            }
        } catch (err) {
            initPropertyCards();
        }
    }

    if (propiedadesGrid) {
        // Intentamos cargar datos dinámicos; si falla, usamos el contenido estático
        fetchAndRenderPropiedades();
    }

    /* CARGAR DATOS EN PÁGINA DE DETALLE */
    if (window.location.pathname.includes('Detalle-Propiedad') || window.location.pathname.includes('Detalle-propiedad')) {
        cargarDetallePropiedad();
    }

    /* SISTEMA DE FILTROS */
    const sinResultados = document.getElementById('sin-resultados');
    const filtroTipo = document.getElementById('tipo-propiedad');
    const filtroUbicacion = document.getElementById('ubicacion');
    const filtroPrecio = document.getElementById('precio');
    const filtroHabitaciones = document.getElementById('habitaciones');
    const filtroSuperficie = document.getElementById('superficie');

    // Utilidad para normalizar textos (quita acentos y pasa a minúsculas)
    function normalizarTexto(txt) {
        return (txt || '')
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    // Resolver rutas de imágenes para que funcionen desde raíz y /Servicios
    function resolveAssetPath(url) {
        if (!url) return '';
        const isHttp = /^https?:\/\//i.test(url);
        if (isHttp) return url;
        const isServicios = window.location.pathname.toLowerCase().includes('/servicios/');
        const base = isServicios ? '../' : './';
        const cleaned = url.replace(/^\/+/, '');
        if (cleaned.startsWith('img/')) return base + cleaned;
        if (cleaned.startsWith('../img/')) return cleaned;
        return cleaned.startsWith('./') ? cleaned : base + cleaned;
    }

    // Mapear estado de BD a operación y etiqueta visible
    function inferOperacion(estadoRaw) {
        const e = normalizarTexto(estadoRaw);
        if (!e) return 'venta';
        if (e.includes('alquil')) return 'alquiler';
        if (e.includes('desocup')) return 'venta';
        if (e.includes('comprad')) return 'venta';
        if (e.includes('venta')) return 'venta';
        return 'venta';
    }

    function formatearTagEstado(estadoRaw) {
        const op = inferOperacion(estadoRaw);
        if (normalizarTexto(estadoRaw).includes('comprad')) return 'vendida';
        return op === 'alquiler' ? 'en alquiler' : 'en venta';
    }

    if (propiedadesGrid) {
        function filtrarPropiedades() {
            const propiedades = propiedadesGrid.querySelectorAll('.propiedad-card');
            let propiedadesVisibles = 0;

            const tipoSeleccionado = filtroTipo ? normalizarTexto(filtroTipo.value) : '';
            const ubicacionSeleccionada = filtroUbicacion ? normalizarTexto(filtroUbicacion.value) : '';
            const precioMaximo = filtroPrecio && filtroPrecio.value ? parseInt(filtroPrecio.value) : null;
            const habitacionesSeleccionadas = filtroHabitaciones ? filtroHabitaciones.value : '';
            const superficieRango = filtroSuperficie ? filtroSuperficie.value : '';

            propiedades.forEach((propiedad) => {
                const tipo = normalizarTexto(propiedad.getAttribute('data-tipo'));
                const ubicacion = normalizarTexto(propiedad.getAttribute('data-ubicacion'));
                const precioStr = propiedad.getAttribute('data-precio') || '0';
                const precio = parseInt(precioStr);
                const habitacionesStr = propiedad.getAttribute('data-hab') || '0';
                const habitaciones = parseInt(habitacionesStr);
                const superficieStr = propiedad.getAttribute('data-superficie') || '0';
                const superficie = parseInt(superficieStr);

                let mostrar = true;

                if (tipoSeleccionado && tipo !== tipoSeleccionado) {
                    mostrar = false;
                }

                if (ubicacionSeleccionada && ubicacion !== ubicacionSeleccionada) {
                    mostrar = false;
                }

                if (precioMaximo !== null && precio > precioMaximo) {
                    mostrar = false;
                }

                if (habitacionesSeleccionadas) {
                    if (habitacionesSeleccionadas === '4') {
                        if (habitaciones < 4) {
                            mostrar = false;
                        }
                    } else if (habitaciones !== parseInt(habitacionesSeleccionadas)) {
                        mostrar = false;
                    }
                }

                if (superficieRango && superficie > 0) {
                    if (superficieRango === '0-200') {
                        if (superficie > 200) mostrar = false;
                    } else if (superficieRango === '200-500') {
                        if (superficie < 200 || superficie > 500) mostrar = false;
                    } else if (superficieRango === '500-1000') {
                        if (superficie < 500 || superficie > 1000) mostrar = false;
                    } else if (superficieRango === '1000-2000') {
                        if (superficie < 1000 || superficie > 2000) mostrar = false;
                    } else if (superficieRango === '2000+') {
                        if (superficie < 2000) mostrar = false;
                    }
                }

                if (mostrar) {
                    propiedad.style.display = 'block';
                    propiedadesVisibles++;
                } else {
                    propiedad.style.display = 'none';
                }
            });

            if (sinResultados) {
                if (propiedadesVisibles === 0) {
                    sinResultados.style.display = 'block';
                } else {
                    sinResultados.style.display = 'none';
                }
            }
        }

        if (filtroTipo) {
            filtroTipo.addEventListener('change', filtrarPropiedades);
        }

        if (filtroUbicacion) {
            filtroUbicacion.addEventListener('change', filtrarPropiedades);
        }

        if (filtroPrecio) {
            filtroPrecio.addEventListener('change', filtrarPropiedades);
        }

        if (filtroHabitaciones) {
            filtroHabitaciones.addEventListener('change', filtrarPropiedades);
        }

        if (filtroSuperficie) {
            filtroSuperficie.addEventListener('change', filtrarPropiedades);
        }

        filtrarPropiedades();
    }
});

// FUNCIÓN GLOBAL PARA CAMBIAR IMAGEN EN GALERÍA
function cambiarImagenPrincipal(thumbnail) {
    const imagenPrincipal = document.getElementById('imagen-principal');
    if (imagenPrincipal) {
        if (thumbnail.tagName === 'VIDEO' || thumbnail.classList.contains('video-thumbnail')) {
            const videoSrc = thumbnail.getAttribute('data-video-src');
            if (videoSrc) {
                imagenPrincipal.outerHTML = `
                    <video id="imagen-principal" controls style="width: 100%; height: 100%; object-fit: contain; background-color: #000;">
                        <source src="${videoSrc}" type="video/mp4">
                        Tu navegador no soporta el elemento de video.
                    </video>
                `;
            }
        } else {
            if (imagenPrincipal.tagName === 'VIDEO') {
                imagenPrincipal.outerHTML = `<img id="imagen-principal" src="${thumbnail.src}" alt="Imagen principal" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                imagenPrincipal.src = thumbnail.src;
            }
        }
    }

    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

// FUNCIÓN PARA CARGAR DETALLE DE PROPIEDAD
function cargarDetallePropiedad() {
    const datosGuardados = localStorage.getItem('propiedadActual');
    if (!datosGuardados) {
        return;
    }

    const datos = JSON.parse(datosGuardados);

    const titulo = document.getElementById('titulo-propiedad');
    if (titulo) titulo.textContent = datos.nombre;

    const ubicacion = document.getElementById('ubicacion-propiedad');
    if (ubicacion) {
        const svg = ubicacion.querySelector('svg');
        ubicacion.innerHTML = '';
        if (svg) ubicacion.appendChild(svg);
        const texto = document.createTextNode(` ${datos.ubicacion.charAt(0).toUpperCase() + datos.ubicacion.slice(1)}, Mendoza`);
        ubicacion.appendChild(texto);
    }

    const precio = document.getElementById('precio-propiedad');
    if (precio) precio.textContent = datos.precio;

    const tipo = document.getElementById('tipo-propiedad');
    if (tipo) tipo.textContent = datos.tipo.charAt(0).toUpperCase() + datos.tipo.slice(1);

    const tag = document.getElementById('estado-tag');
    if (tag) tag.textContent = datos.tag;

    const habitaciones = document.getElementById('habitaciones-propiedad');
    if (habitaciones) {
        const numHab = datos.habitaciones;
        habitaciones.textContent = numHab === '0' ? 'Sin habitaciones' : `${numHab} habitacion${numHab === '1' ? '' : 'es'}`;
    }

    const banos = document.getElementById('banos-propiedad');
    if (banos && datos.caracteristicas) {
        const match = datos.caracteristicas.match(/(\d+)\s*baño/i);
        if (match) {
            banos.textContent = `${match[1]} baño${match[1] === '1' ? '' : 's'}`;
        }
    }

    const superficieTerreno = document.getElementById('superficie-terreno');
    if (superficieTerreno) {
        superficieTerreno.textContent = `${datos.superficie} m² terreno`;
    }

    const superficieCubierta = document.getElementById('superficie-cubierta');
    if (superficieCubierta) {
        const cubierta = Math.round(datos.superficie * 0.7);
        superficieCubierta.textContent = `${cubierta} m² cubiertos`;
    }

    const imagenPrincipal = document.getElementById('imagen-principal');
    const thumbnailsContainer = document.querySelector('.galeria-thumbnails');

    if (datos.imagenes && datos.imagenes.length > 0) {
        if (imagenPrincipal) {
            imagenPrincipal.src = datos.imagenes[0];
        }

        if (thumbnailsContainer) {
            thumbnailsContainer.innerHTML = '';

            datos.imagenes.forEach((imagen, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.className = index === 0 ? 'thumbnail active' : 'thumbnail';
                thumbnail.src = imagen;
                thumbnail.alt = `Imagen ${index + 1}`;
                thumbnail.onclick = function() { cambiarImagenPrincipal(this); };
                thumbnailsContainer.appendChild(thumbnail);
            });

            if (datos.video) {
                const videoThumbnail = document.createElement('div');
                videoThumbnail.className = 'thumbnail video-thumbnail';
                videoThumbnail.setAttribute('data-video-src', datos.video);
                videoThumbnail.onclick = function() { cambiarImagenPrincipal(this); };
                videoThumbnail.innerHTML = `
                    <video style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;">
                        <source src="${datos.video}" type="video/mp4">
                    </video>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(237, 50, 55, 0.8); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                `;
                videoThumbnail.style.position = 'relative';
                videoThumbnail.style.cursor = 'pointer';
                thumbnailsContainer.appendChild(videoThumbnail);
            }
        }
    }

    const descripcion = document.getElementById('descripcion-propiedad');
    if (descripcion) {
        let textoDescripcion = `Excelente ${datos.tipo} ubicada en ${datos.ubicacion.charAt(0).toUpperCase() + datos.ubicacion.slice(1)}, Mendoza. `;
        if (datos.habitaciones !== '0') {
            textoDescripcion += `Cuenta con ${datos.habitaciones} dormitorio${datos.habitaciones === '1' ? '' : 's'} amplios con buena iluminación natural. `;
        }
        textoDescripcion += `La propiedad tiene una superficie total de ${datos.superficie} m², perfecta para quienes buscan espacio y comodidad. `;
        textoDescripcion += `Ubicación estratégica con fácil acceso a servicios, comercios y vías principales. Ideal para familias o inversores.`;
        descripcion.textContent = textoDescripcion;
    }

    const formularioConsulta = document.getElementById('formulario-consulta');
    const propiedadInput = document.getElementById('propiedad-consulta');

    if (formularioConsulta && propiedadInput) {
        propiedadInput.value = datos.nombre;

        formularioConsulta.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre-consulta').value;
            const email = document.getElementById('email-consulta').value;
            const telefono = document.getElementById('telefono-consulta').value;
            const mensaje = document.getElementById('mensaje-consulta').value;

            const tipoOperacion = datos.operacion || 'Venta';
            const emojiOperacion = tipoOperacion === 'Alquiler' ? '🏠' : '🏡';

            let mensajeWhatsApp = `${emojiOperacion} *Consulta sobre ${tipoOperacion}: ${datos.nombre}*%0A%0A`;
            mensajeWhatsApp += `👤 *Nombre:* ${nombre}%0A`;
            mensajeWhatsApp += `📧 *Email:* ${email}%0A`;
            mensajeWhatsApp += `📱 *Teléfono:* ${telefono}%0A%0A`;
            mensajeWhatsApp += `💬 *Consulta:*%0A${encodeURIComponent(mensaje)}%0A%0A`;
            mensajeWhatsApp += `🏘️ *Detalles de la propiedad:*%0A`;
            mensajeWhatsApp += `• *Operación:* ${tipoOperacion}%0A`;
            mensajeWhatsApp += `• *Tipo:* ${datos.tipo}%0A`;
            mensajeWhatsApp += `• *Ubicación:* ${datos.ubicacion}%0A`;
            mensajeWhatsApp += `• *Precio:* ${datos.precio}`;

            const numeroWhatsApp = '5492634715111';

            window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`, '_blank');

            formularioConsulta.style.display = 'none';
            const mensajeExito = document.getElementById('mensaje-exito');
            if (mensajeExito) {
                mensajeExito.style.display = 'block';
                mensajeExito.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    }
}