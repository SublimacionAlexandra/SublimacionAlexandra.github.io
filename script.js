/* ============================================================
   SUBLIMACIÓN ALEXANDRA — script.js
   Una sola inicialización · PWA · modal de producto · menú
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
     Bloqueo de scroll compatible con iOS
     (body fijo conserva la posición; se libera al cerrar)
     ---------------------------------------------------------- */

  var bloqueos = 0;
  var scrollGuardado = 0;

  function bloquearScroll() {
    if (bloqueos === 0) {
      scrollGuardado = window.pageYOffset || document.documentElement.scrollTop;
      body.style.position = 'fixed';
      body.style.top = -scrollGuardado + 'px';
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
    }
    bloqueos += 1;
  }

  function liberarScroll() {
    bloqueos = Math.max(0, bloqueos - 1);

    if (bloqueos === 0) {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';

      /* Restaurar sin animación de scroll (evita el salto suave) */
      var raiz = document.documentElement;
      var comportamientoPrevio = raiz.style.scrollBehavior;
      raiz.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollGuardado);
      raiz.style.scrollBehavior = comportamientoPrevio;
    }
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
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  }

  if (menuToggle && navegacion) {

    menuToggle.addEventListener('click', function () {
      var abierto = navegacion.classList.toggle('activo');
      menuToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
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

    var mostrarSlide = function (numero) {
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === numero);
      });
    };

    var siguienteSlide = function () {
      indice = (indice + 1) % slides.length;
      mostrarSlide(indice);
    };

    var arrancarCarrusel = function () {
      window.clearInterval(temporizador);
      temporizador = window.setInterval(siguienteSlide, INTERVALO);
    };

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
     Animaciones de entrada
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
     Contadores (el número final ya está en el HTML)
     ---------------------------------------------------------- */

  var contadores = $$('.contador');

  var formatearNumero = function (valor) {
    return valor.toLocaleString('es-BO');
  };

  var animarContador = function (elemento) {
    var objetivo = parseInt(elemento.getAttribute('data-target'), 10) || 0;
    var duracion = 1500;
    var inicio = null;

    var paso = function (marca) {
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
    };

    elemento.textContent = '0';
    window.requestAnimationFrame(paso);
  };

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

    var abrirLightbox = function (imagen) {
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
    };

    var cerrarLightbox = function () {
      lightbox.classList.remove('activo');
      lightbox.setAttribute('aria-hidden', 'true');
      liberarScroll();

      if (origenLightbox) {
        origenLightbox.focus();
      }
    };

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
     Vista previa del producto (modal)
     Se abre al tocar cualquier parte de la tarjeta
     ---------------------------------------------------------- */

  var modal = $('#modalProducto');
  var modalContenido = $('#modalContenido');

  if (modal) {

    var modalImagen = $('#modalImagen');
    var modalTitulo = $('#modalTitulo');
    var modalDescripcion = $('#modalDescripcion');
    var modalPrecio = $('#modalPrecio');
    var modalWhatsapp = $('#modalWhatsapp');
    var modalCategoria = $('#modalCategoria');
    var modalCompartir = $('#modalCompartir');
    var modalInfo = $('.modal-info', modal);
    var cerrarModalBoton = $('.modal-cerrar', modal);
    var focoAnterior = null;
    var productoActual = { nombre: '', descripcion: '' };

    var abrirModal = function (tarjeta) {

      if (!tarjeta) {
        return;
      }

      var imagen = $('img', tarjeta);
      var titulo = $('h3', tarjeta);
      var descripcion = $('p', tarjeta);
      var precio = $('.precio', tarjeta);
      var enlaceCompra = $('.btn-comprar', tarjeta);
      var seccion = tarjeta.closest('section');
      var titularSeccion = seccion ? $('.titulo h2', seccion) : null;

      productoActual.nombre = titulo ? titulo.textContent.trim() : '';
      productoActual.descripcion = descripcion ? descripcion.textContent.trim() : '';

      if (modalImagen && imagen) {
        modalImagen.src = imagen.currentSrc || imagen.src;
        modalImagen.alt = imagen.alt || '';
      }

      if (modalTitulo) {
        modalTitulo.textContent = productoActual.nombre;
      }

      if (modalDescripcion) {
        modalDescripcion.textContent = productoActual.descripcion;
      }

      if (modalCategoria) {
        var categoria = titularSeccion
          ? titularSeccion.textContent.replace(/personalizad[oa]s?/gi, '').trim()
          : '';
        modalCategoria.textContent = categoria || 'Personalizado';
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

      if (modalInfo) {
        modalInfo.scrollTop = 0;
      }

      if (cerrarModalBoton) {
        cerrarModalBoton.focus();
      }
    };

    var cerrarModal = function () {
      modal.classList.remove('activo');
      modal.setAttribute('aria-hidden', 'true');
      liberarScroll();

      if (focoAnterior && typeof focoAnterior.focus === 'function') {
        focoAnterior.focus();
      }
    };

    /* Toda la tarjeta abre la vista previa, salvo enlaces y el botón */
    $$('.card').forEach(function (tarjeta) {
      tarjeta.addEventListener('click', function (evento) {
        if (evento.target.closest('a')) {
          return;
        }
        if (evento.target.closest('.btn-ver')) {
          return;
        }
        abrirModal(tarjeta);
      });
    });

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

    /* Deslizar hacia abajo para cerrar (solo móvil y desde arriba) */
    if (modalContenido) {

      var inicioToque = null;
      var desplazamiento = 0;

      modalContenido.addEventListener('touchstart', function (evento) {
        if (window.innerWidth > 768) {
          return;
        }
        if (modalInfo && modalInfo.scrollTop > 0) {
          return;
        }
        inicioToque = evento.touches[0].clientY;
        desplazamiento = 0;
        modalContenido.style.transition = 'none';
      }, { passive: true });

      modalContenido.addEventListener('touchmove', function (evento) {
        if (inicioToque === null) {
          return;
        }
        desplazamiento = evento.touches[0].clientY - inicioToque;
        if (desplazamiento > 0) {
          modalContenido.style.transform = 'translateY(' + desplazamiento + 'px)';
        }
      }, { passive: true });

      modalContenido.addEventListener('touchend', function () {
        if (inicioToque === null) {
          return;
        }

        modalContenido.style.transition = '';
        modalContenido.style.transform = '';

        if (desplazamiento > 90) {
          cerrarModal();
        }

        inicioToque = null;
        desplazamiento = 0;
      });
    }

    /* Compartir producto */
    if (modalCompartir) {
      modalCompartir.addEventListener('click', function () {

        var datos = {
          title: productoActual.nombre + ' · Sublimación Alexandra',
          text: productoActual.descripcion,
          url: window.location.href
        };

        if (navigator.share) {
          navigator.share(datos).catch(function () {
            /* el usuario canceló */
          });
          return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(window.location.href).then(function () {
            var original = modalCompartir.innerHTML;
            modalCompartir.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
            modalCompartir.setAttribute('aria-label', 'Enlace copiado');

            window.setTimeout(function () {
              modalCompartir.innerHTML = original;
              modalCompartir.setAttribute('aria-label', 'Compartir este producto');
            }, 1800);
          }).catch(function () {});
        }
      });
    }
  }

  /* ----------------------------------------------------------
     Popup promocional
     - La imagen no se descarga hasta que se muestra
     - Una sola vez por sesión
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

    var ocultarPopup = function () {
      popup.classList.remove('activo');
      popup.setAttribute('aria-hidden', 'true');
      liberarScroll();

      try {
        window.sessionStorage.setItem(CLAVE_SESION, '1');
      } catch (error) {
        /* sin almacenamiento */
      }
    };

    var mostrarPopup = function () {
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
    };

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
     Banner de instalación (PWA)
     ---------------------------------------------------------- */

  var bannerInstalar = $('#instalarApp');

  if (bannerInstalar) {

    var botonInstalar = $('#instalarBoton');
    var cerrarInstalar = $('#instalarCerrar');
    var tituloInstalar = $('#instalarTitulo');
    var descInstalar = $('#instalarDesc');

    var promptDiferido = null;
    var CLAVE_OCULTO = 'instalarOcultoHasta';
    var DIAS_OCULTO = 21;
    var intentos = 0;

    var yaInstalada = function () {
      return window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
    };

    var ocultadaPorUsuario = function () {
      try {
        var hasta = parseInt(window.localStorage.getItem(CLAVE_OCULTO) || '0', 10);
        return Date.now() < hasta;
      } catch (error) {
        return false;
      }
    };

    var recordarOculto = function () {
      try {
        window.localStorage.setItem(CLAVE_OCULTO, String(Date.now() + DIAS_OCULTO * 86400000));
      } catch (error) {
        /* sin almacenamiento */
      }
    };

    var mostrarBanner = function () {
      if (yaInstalada() || ocultadaPorUsuario() || bannerInstalar.classList.contains('visible')) {
        return;
      }

      bannerInstalar.hidden = false;

      window.requestAnimationFrame(function () {
        bannerInstalar.classList.add('visible');
        body.classList.add('con-instalar');
      });
    };

    var ocultarBanner = function (recordar) {
      bannerInstalar.classList.remove('visible');
      body.classList.remove('con-instalar');

      if (recordar) {
        recordarOculto();
      }

      window.setTimeout(function () {
        if (!bannerInstalar.classList.contains('visible')) {
          bannerInstalar.hidden = true;
        }
      }, 450);
    };

    /* No tapar el popup de promoción: si está abierto, reintenta */
    var mostrarSiSePuede = function () {
      if (popup && popup.classList.contains('activo')) {
        if (intentos < 3) {
          intentos += 1;
          window.setTimeout(mostrarSiSePuede, 8000);
        }
        return;
      }
      mostrarBanner();
    };

    var esIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

    if (esIOS) {
      if (tituloInstalar) {
        tituloInstalar.textContent = 'Añade la tienda a tu inicio';
      }
      if (descInstalar) {
        descInstalar.textContent = 'Toca el botón Compartir y elige «Añadir a pantalla de inicio».';
      }
      if (botonInstalar) {
        botonInstalar.textContent = 'Entendido';
      }
      window.setTimeout(mostrarSiSePuede, 6000);
    }

    window.addEventListener('beforeinstallprompt', function (evento) {
      evento.preventDefault();
      promptDiferido = evento;
      window.setTimeout(mostrarSiSePuede, 4500);
    });

    window.addEventListener('appinstalled', function () {
      ocultarBanner(true);
    });

    if (botonInstalar) {
      botonInstalar.addEventListener('click', function () {

        if (promptDiferido) {
          promptDiferido.prompt();
          promptDiferido.userChoice.then(function () {
            promptDiferido = null;
            ocultarBanner(true);
          }).catch(function () {
            ocultarBanner(true);
          });
          return;
        }

        ocultarBanner(true);
      });
    }

    if (cerrarInstalar) {
      cerrarInstalar.addEventListener('click', function () {
        ocultarBanner(true);
      });
    }
  }

  /* ----------------------------------------------------------
     Service Worker (tienda disponible sin conexión)
     ---------------------------------------------------------- */

  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function (registro) {
        document.addEventListener('visibilitychange', function () {
          if (!document.hidden) {
            registro.update().catch(function () {});
          }
        });
      }).catch(function () {
        /* si falla, el sitio funciona igual */
      });
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
