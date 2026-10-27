/* ============================================================
   SUBLIMACIÓN ALEXANDRA — script.js
   Un solo archivo, una sola inicialización (sin duplicados)
   ============================================================ */

(function () {
  'use strict';

  var $ = function (selector, context) {
    return (context || document).querySelector(selector);
  };

  var $$ = function (selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  };

  var body = document.body;

  /* ----------------------------------------------------------
     Utilidades de scroll bloqueado (modales)
     ---------------------------------------------------------- */

  function bloquearScroll() {
    body.style.overflow = 'hidden';
  }

  function liberarScroll() {
    body.style.overflow = '';
  }

  /* ----------------------------------------------------------
     Header con sombra + botón "volver arriba"
     ---------------------------------------------------------- */

  var header = $('header');
  var volverArriba = $('.volver-arriba');
  var pendiente = false;

  function alHacerScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (header) {
      header.classList.toggle('header-scroll', y > 10);
    }

    if (volverArriba) {
      volverArriba.classList.toggle('visible', y > 500);
    }

    pendiente = false;
  }

  window.addEventListener('scroll', function () {
    if (!pendiente) {
      window.requestAnimationFrame(alHacerScroll);
      pendiente = true;
    }
  }, { passive: true });

  alHacerScroll();

  if (volverArriba) {
    volverArriba.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     Menú móvil
     ---------------------------------------------------------- */

  var menuToggle = $('.menu-toggle');
  var navegacion = $('#menu-principal');

  function cerrarMenu() {
    if (!navegacion || !menuToggle) {
      return;
    }
    navegacion.classList.remove('activo');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && navegacion) {

    menuToggle.addEventListener('click', function () {
      var abierto = navegacion.classList.toggle('activo');
      menuToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });

    $$('a', navegacion).forEach(function (enlace) {
      enlace.addEventListener('click', cerrarMenu);
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape') {
        cerrarMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) {
        cerrarMenu();
      }
    });
  }

  /* ----------------------------------------------------------
     Carrusel del banner
     ---------------------------------------------------------- */

  var slides = $$('.slide');

  if (slides.length > 1) {

    var indice = 0;
    var temporizador = null;
    var INTERVALO = 5000;

    function mostrarSlide(numero) {
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === numero);
      });
    }

    function siguienteSlide() {
      indice = (indice + 1) % slides.length;
      mostrarSlide(indice);
    }

    function arrancarCarrusel() {
      window.clearInterval(temporizador);
      temporizador = window.setInterval(siguienteSlide, INTERVALO);
    }

    arrancarCarrusel();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        window.clearInterval(temporizador);
      } else {
        arrancarCarrusel();
      }
    });
  }

  /* ----------------------------------------------------------
     Animaciones de entrada (solo si el navegador lo soporta)
     ---------------------------------------------------------- */

  var animables = $$('.card, .beneficio, .estadistica, .galeria img, .ubicacion-info');

  if ('IntersectionObserver' in window && animables.length) {

    animables.forEach(function (elemento) {
      elemento.classList.add('animar');
    });

    var observadorAnimacion = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observadorAnimacion.unobserve(entrada.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animables.forEach(function (elemento) {
      observadorAnimacion.observe(elemento);
    });
  }

  /* ----------------------------------------------------------
     Contadores de estadísticas
     (el número final ya está en el HTML: si falla el JS, se ve)
     ---------------------------------------------------------- */

  var contadores = $$('.contador');

  function formatearNumero(valor) {
    return valor.toLocaleString('es-BO');
  }

  function animarContador(elemento) {
    var objetivo = parseInt(elemento.getAttribute('data-target'), 10) || 0;
    var duracion = 1500;
    var inicio = null;

    function paso(marca) {
      if (inicio === null) {
        inicio = marca;
      }

      var avance = Math.min((marca - inicio) / duracion, 1);
      var suavizado = 1 - Math.pow(1 - avance, 3);

      elemento.textContent = formatearNumero(Math.round(objetivo * suavizado));

      if (avance < 1) {
        window.requestAnimationFrame(paso);
      } else {
        elemento.textContent = formatearNumero(objetivo);
      }
    }

    elemento.textContent = '0';
    window.requestAnimationFrame(paso);
  }

  if (contadores.length && 'IntersectionObserver' in window) {

    var observadorContadores = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          animarContador(entrada.target);
          observadorContadores.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.4 });

    contadores.forEach(function (contador) {
      observadorContadores.observe(contador);
    });
  }

  /* ----------------------------------------------------------
     Lightbox de la galería
     ---------------------------------------------------------- */

  var lightbox = $('.lightbox');

  if (lightbox) {

    var imagenLightbox = $('#imagenLightbox');
    var cerrarLightboxBoton = $('.lightbox-cerrar', lightbox);
    var origenLightbox = null;

    function abrirLightbox(imagen) {
      if (!imagenLightbox) {
        return;
      }

      imagenLightbox.src = imagen.currentSrc || imagen.src;
      imagenLightbox.alt = imagen.alt || '';
      origenLightbox = imagen;
      lightbox.classList.add('activo');
      lightbox.setAttribute('aria-hidden', 'false');
      bloquearScroll();

      if (cerrarLightboxBoton) {
        cerrarLightboxBoton.focus();
      }
    }

    function cerrarLightbox() {
      lightbox.classList.remove('activo');
      lightbox.setAttribute('aria-hidden', 'true');
      liberarScroll();

      if (origenLightbox) {
        origenLightbox.focus();
      }
    }

    $$('.galeria img').forEach(function (imagen) {
      imagen.setAttribute('tabindex', '0');
      imagen.setAttribute('role', 'button');
      imagen.setAttribute('aria-label', 'Ampliar imagen: ' + (imagen.alt || ''));

      imagen.addEventListener('click', function () {
        abrirLightbox(imagen);
      });

      imagen.addEventListener('keydown', function (evento) {
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          abrirLightbox(imagen);
        }
      });
    });

    if (cerrarLightboxBoton) {
      cerrarLightboxBoton.addEventListener('click', cerrarLightbox);
    }

    lightbox.addEventListener('click', function (evento) {
      if (evento.target === lightbox) {
        cerrarLightbox();
      }
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && lightbox.classList.contains('activo')) {
        cerrarLightbox();
      }
    });
  }

  /* ----------------------------------------------------------
     Modal de producto (los botones "Ver detalles")
     ---------------------------------------------------------- */

  var modal = $('#modalProducto');

  if (modal) {

    var modalImagen = $('#modalImagen');
    var modalTitulo = $('#modalTitulo');
    var modalDescripcion = $('#modalDescripcion');
    var modalPrecio = $('#modalPrecio');
    var modalWhatsapp = $('#modalWhatsapp');
    var cerrarModalBoton = $('.modal-cerrar', modal);
    var focoAnterior = null;

    function abrirModal(tarjeta) {

      if (!tarjeta) {
        return;
      }

      var imagen = $('img', tarjeta);
      var titulo = $('h3', tarjeta);
      var descripcion = $('p', tarjeta);
      var precio = $('.precio', tarjeta);
      var enlaceCompra = $('.btn-comprar', tarjeta);

      if (modalImagen && imagen) {
        modalImagen.src = imagen.currentSrc || imagen.src;
        modalImagen.alt = imagen.alt || '';
      }

      if (modalTitulo) {
        modalTitulo.textContent = titulo ? titulo.textContent.trim() : '';
      }

      if (modalDescripcion) {
        modalDescripcion.textContent = descripcion ? descripcion.textContent.trim() : '';
      }

      if (modalPrecio) {
        modalPrecio.textContent = precio ? precio.textContent.trim() : '';
        modalPrecio.classList.toggle(
          'consultar',
          !!(precio && precio.classList.contains('consultar'))
        );
      }

      if (modalWhatsapp && enlaceCompra) {
        modalWhatsapp.href = enlaceCompra.getAttribute('href');
      }

      focoAnterior = document.activeElement;
      modal.classList.add('activo');
      modal.setAttribute('aria-hidden', 'false');
      bloquearScroll();

      if (cerrarModalBoton) {
        cerrarModalBoton.focus();
      }
    }

    function cerrarModal() {
      modal.classList.remove('activo');
      modal.setAttribute('aria-hidden', 'true');
      liberarScroll();

      if (focoAnterior && typeof focoAnterior.focus === 'function') {
        focoAnterior.focus();
      }
    }

    $$('.card .btn-ver').forEach(function (boton) {
      boton.addEventListener('click', function () {
        abrirModal(boton.closest('.card'));
      });
    });

    if (cerrarModalBoton) {
      cerrarModalBoton.addEventListener('click', cerrarModal);
    }

    modal.addEventListener('click', function (evento) {
      if (evento.target === modal) {
        cerrarModal();
      }
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && modal.classList.contains('activo')) {
        cerrarModal();
      }
    });
  }

  /* ----------------------------------------------------------
     Popup promocional
     - La imagen NO se descarga hasta que se muestra
     - Se muestra una sola vez por sesión
     ---------------------------------------------------------- */

  var popup = $('#popupPromocion');

  if (popup) {

    var cerrarPopupBoton = $('#cerrarPopup');
    var popupImagen = $('img', popup);
    var CLAVE_SESION = 'promoAniversarioCuevo';
    var yaVista = false;

    try {
      yaVista = window.sessionStorage.getItem(CLAVE_SESION) === '1';
    } catch (error) {
      yaVista = false;
    }

    function ocultarPopup() {
      popup.classList.remove('activo');
      popup.setAttribute('aria-hidden', 'true');
      liberarScroll();

      try {
        window.sessionStorage.setItem(CLAVE_SESION, '1');
      } catch (error) {
        /* Sin almacenamiento disponible: no pasa nada */
      }
    }

    function mostrarPopup() {
      if (popupImagen) {
        var diferida = popupImagen.getAttribute('data-src');
        if (diferida) {
          popupImagen.src = diferida;
          popupImagen.removeAttribute('data-src');
        }
      }

      popup.classList.add('activo');
      popup.setAttribute('aria-hidden', 'false');
      bloquearScroll();

      if (cerrarPopupBoton) {
        cerrarPopupBoton.focus();
      }
    }

    if (!yaVista) {
      window.setTimeout(mostrarPopup, 1600);
    }

    if (cerrarPopupBoton) {
      cerrarPopupBoton.addEventListener('click', ocultarPopup);
    }

    popup.addEventListener('click', function (evento) {
      if (evento.target === popup) {
        ocultarPopup();
      }
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && popup.classList.contains('activo')) {
        ocultarPopup();
      }
    });
  }

  /* ----------------------------------------------------------
     Año del pie de página
     ---------------------------------------------------------- */

  var anio = $('#anio');

  if (anio) {
    anio.textContent = new Date().getFullYear();
  }

})();
