/* ============================================================
   Sublimación Alexandra — service worker
   Estrategia:
   · Navegación  → red primero, caché como respaldo (offline)
   · Imágenes    → caché primero (con límite de entradas)
   · CSS/JS      → sirve caché y actualiza en segundo plano
   ============================================================ */

var VERSION = 'v2.0.0';
var CACHE_APP = 'alexandra-app-' + VERSION;
var CACHE_IMG = 'alexandra-img-' + VERSION;
var CACHE_EXT = 'alexandra-ext-' + VERSION;

/* Fuentes e íconos de CDN: se guardan para que la app se vea bien sin internet */
var PERMITIDOS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com'
];

var ARCHIVOS_BASE = [
  './',
  './index.html',
  './offline.html',
  './style.css',
  './script.js',
  './manifest.webmanifest',
  './favicon.svg',
  './favicon-32.png',
  './apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './og-image.jpg'
];

var MAX_IMAGENES = 60;

/* Resuelve rutas relativas contra el scope del service worker.
   Evita problemas al crear peticiones con rutas relativas. */
function absoluta(ruta) {
  return new URL(ruta, self.registration.scope).href;
}

/* ------------------------------------------------------------ install */

self.addEventListener('install', function (evento) {

  evento.waitUntil(
    caches.open(CACHE_APP).then(function (cache) {
      /* uno por uno: si un archivo falla, la instalación no se cae */
      return Promise.all(ARCHIVOS_BASE.map(function (url) {
        return cache.add(new Request(absoluta(url), { cache: 'reload' })).catch(function () {
          return null;
        });
      }));
    }).then(function () {
      return self.skipWaiting();
    })
  );

});

/* ------------------------------------------------------------ activate */

self.addEventListener('activate', function (evento) {

  evento.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(claves.map(function (clave) {
        if (clave !== CACHE_APP && clave !== CACHE_IMG && clave !== CACHE_EXT) {
          return caches.delete(clave);
        }
        return null;
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );

});

/* ------------------------------------------------------------ utilidades */

function esImagen(peticion, url) {
  if (peticion.destination === 'image') {
    return true;
  }
  return /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(url.pathname);
}

function recortarCache(nombre, maximo) {

  return caches.open(nombre).then(function (cache) {
    return cache.keys().then(function (peticiones) {
      if (peticiones.length <= maximo) {
        return null;
      }

      var sobrantes = peticiones.slice(0, peticiones.length - maximo);

      return Promise.all(sobrantes.map(function (peticion) {
        return cache.delete(peticion);
      }));
    });
  });
}

/* ------------------------------------------------------------ fetch */

self.addEventListener('fetch', function (evento) {

  var peticion = evento.request;

  if (peticion.method !== 'GET') {
    return;
  }

  var url = new URL(peticion.url);

  /* Fuentes e íconos de CDN: se guardan en su propia caché.
     Cualquier otro origen (mapa de Google) lo maneja el navegador. */
  if (url.origin !== self.location.origin) {

    if (PERMITIDOS.indexOf(url.hostname) === -1) {
      return;
    }

    evento.respondWith(
      caches.open(CACHE_EXT).then(function (cache) {
        return cache.match(peticion).then(function (guardada) {

          var desdeRed = fetch(peticion).then(function (respuesta) {
            if (respuesta && (respuesta.ok || respuesta.type === 'opaque')) {
              cache.put(peticion, respuesta.clone());
            }
            return respuesta;
          }).catch(function () {
            return null;
          });

          return guardada || desdeRed.then(function (respuesta) {
            return respuesta || Response.error();
          });
        });
      })
    );

    return;
  }

  /* --- Navegación: red primero, caché si no hay internet --- */
  if (peticion.mode === 'navigate') {

    evento.respondWith(
      fetch(peticion).then(function (respuesta) {
        var copia = respuesta.clone();
        caches.open(CACHE_APP).then(function (cache) {
          cache.put(absoluta('./index.html'), copia);
        });
        return respuesta;
      }).catch(function () {
        return caches.open(CACHE_APP).then(function (cache) {
          return cache.match(absoluta('./index.html')).then(function (guardada) {
            return guardada || cache.match(absoluta('./offline.html'));
          });
        }).then(function (respuesta) {
          return respuesta || new Response('Sin conexión', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });
      })
    );

    return;
  }

  /* --- Imágenes: caché primero, se guardan al verlas --- */
  if (esImagen(peticion, url)) {

    evento.respondWith(
      caches.open(CACHE_IMG).then(function (cache) {
        return cache.match(peticion).then(function (guardada) {

          if (guardada) {
            return guardada;
          }

          return fetch(peticion).then(function (respuesta) {
            if (respuesta && respuesta.ok) {
              cache.put(peticion, respuesta.clone());
              recortarCache(CACHE_IMG, MAX_IMAGENES);
            }
            return respuesta;
          }).catch(function () {
            return new Response('', { status: 404 });
          });
        });
      })
    );

    return;
  }

  /* --- CSS, JS y resto: caché primero con actualización en segundo plano --- */
  evento.respondWith(
    caches.open(CACHE_APP).then(function (cache) {
      return cache.match(peticion).then(function (guardada) {

        var desdeRed = fetch(peticion).then(function (respuesta) {
          if (respuesta && respuesta.ok) {
            cache.put(peticion, respuesta.clone());
          }
          return respuesta;
        }).catch(function () {
          return null;
        });

        return guardada || desdeRed.then(function (respuesta) {
          return respuesta || new Response('', { status: 504 });
        });
      });
    })
  );

});
