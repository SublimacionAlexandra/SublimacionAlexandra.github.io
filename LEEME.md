# Sublimación Alexandra — sitio corregido + PWA

Sitio listo para subir a GitHub Pages. Incluye:
correcciones, sección de **ubicación con mapa** (reemplaza los testimonios),
**PWA instalable**, íconos de todos los tamaños (incluido maskable) y
**vista previa del producto** al tocar cualquier tarjeta.

---

## 1. Qué hay en la carpeta

### Archivos del sitio (raíz del repositorio)

| Archivo | Estado | Para qué sirve |
|---|---|---|
| `index.html` | **reemplaza** | Página completa |
| `style.css` | **reemplaza** | Estilos depurados |
| `script.js` | **reemplaza** | Menú, modal, carrusel, PWA |
| `manifest.webmanifest` | **nuevo** | Ficha de la app (nombre, íconos, colores) |
| `sw.js` | **nuevo** | Service worker: permite abrirla sin internet |
| `offline.html` | **nuevo** | Pantalla que se muestra si no hay conexión |
| `og-image.jpg` | **nuevo** | Tarjeta al compartir el link |
| `favicon.svg` | **nuevo** | Ícono de la pestaña |
| `favicon-32.png` | **nuevo** | Ícono de respaldo |
| `apple-touch-icon.png` | **nuevo** | Ícono al añadir a inicio en iPhone |
| `robots.txt` | **nuevo** | Permite que Google indexe |
| `sitemap.xml` | **nuevo** | Mapa del sitio para Google |

### Carpeta `icons/` (nueva)

10 archivos: `icon-72`, `96`, `128`, `144`, `152`, `192`, `384`, `512`
y `maskable-192`, `maskable-512`.

> Sube la carpeta `icons/` **completa**, con ese nombre exacto.
> Si ya habías subido un `icon-512.png` suelto en la raíz, bórralo: ahora la ruta es `icons/icon-512.png`.

Total: **12 archivos + 1 carpeta**.

---

## 2. Qué borrar del repositorio

| Archivo / carpeta | Por qué |
|---|---|
| `productos.json` | Ninguna página lo usa y sus rutas están mal |
| `galeria/WhatsApp Image 2026-08-02 at 18.40.30 (3).jpeg` | Foto suelta, nombre con espacios |
| `clientes/` (carpeta) | Ya no hay testimonios y son fotos de personas reales |
| `icon-512.png` (si quedó en la raíz) | Se reemplazó por `icons/icon-512.png` |

---

## 3. Cómo subirlo a GitHub

1. Entra a `github.com/SublimacionAlexandra/SublimacionAlexandra.github.io`
2. **Add file → Upload files**
3. Arrastra los 12 archivos **y la carpeta `icons/`**
4. Mensaje: `PWA + mapa + modal de producto`
5. **Commit changes** y espera 1–2 minutos

> Para subir la carpeta: arrástrala tal cual. GitHub conserva la ruta `icons/…`.
> Si no te deja, crea la carpeta con **Add file → Create new file** escribiendo
> `icons/icon-192.png`… pero es más fácil arrastrarla.

**Importante:** en el mismo commit deben ir `index.html` y `sw.js`. Si subes el
`sw.js` y el navegador guarda una versión vieja del sitio, fuerza la recarga con
**Ctrl + Shift + R** o borra los datos del sitio.

---

## 4. Cómo probar la PWA

1. Abre el sitio en **Chrome para Android** (o Chrome/Edge en PC).
2. A los pocos segundos aparece el **banner de instalación** abajo.
3. Toca **Instalar** → queda como app, con ícono propio.
4. En **iPhone** el banner explica: *Compartir → Añadir a pantalla de inicio*
   (Safari no permite instalación automática).
5. Para comprobar que funciona sin internet: abre la app, activa **modo avión**
   y vuelve a entrar. Debe cargar desde caché.

### Si actualizas el sitio y no ves los cambios
El service worker guarda una copia. Sube el cambio y **sube también la versión**:
en `sw.js` cambia la primera línea
`var VERSION = 'v2.0.0';` → `'v2.0.1'`. Eso borra la caché vieja sola.

---

## 5. Lo que tienes que personalizar sí o sí

### a) El mapa con tu dirección exacta
Ahora apunta al centro de Cuevo. En `index.html` busca `maps.google.com/maps?q=`,
reemplaza `Cuevo%2C%20Santa%20Cruz%2C%20Bolivia` por tus coordenadas
(ej. `-20.4512,-63.5231`, se copian con clic derecho en Google Maps) y haz lo mismo
en el botón "Cómo llegar" (`destination=`).

### b) Los precios "a consultar"
```html
<div class="precio consultar">Precio a consultar</div>
```
cámbialo por:
```html
<div class="precio">Desde 45 Bs</div>
```

### c) Las estadísticas
`1.500` productos, `850` clientes y `9` departamentos venían del sitio anterior.
Si no son reales, corrígelos.

### d) Los enlaces de Facebook y TikTok
Están igual que antes; verifica que abran bien.

---

## 6. Lo más importante que queda pendiente: el peso de las imágenes

El código ya usa `loading="lazy"`, pero los archivos pesan lo mismo: **~4,9 MB**.
Ahora, además, el service worker las guarda en caché, así que la primera visita
sigue siendo la más lenta.

| Imagen | Peso | Bajar a |
|---|---|---|
| `imagenes/banner1.jpg` | 414 KB | ~110 KB |
| `imagenes/banner2.jpg` | 510 KB | ~110 KB |
| `imagenes/banner3.jpg` | 554 KB | ~110 KB |
| `promocion-gorra-cuevo.jpg` | 734 KB | ~150 KB |
| `galeria/trabajo6.jpg` | 353 KB | ~120 KB |
| `gorras/gorra3.jpg` | **4 KB** | reemplazar (borrosa) |
| `tazas/taza2.jpg` | **8 KB** | reemplazar (borrosa) |

**Gratis y sin instalar nada:** `squoosh.app` → arrastra la foto → *Resize* 1600 px
→ WebP calidad 80 (o JPG 80) → descarga → súbela con el mismo nombre.

---

## 7. Siguiente paso recomendado

- **Google Business Profile**: es lo que te hace aparecer en el mapa de Google
  cuando alguien busca "sublimación Cuevo". Gratis y de alto impacto.
- **Google Search Console**: para ver con qué palabras te encuentran.
- **Dominio propio** (`sublimacionalexandra.com`) en lugar de `github.io`.
  Ojo: si cambias de dominio, actualiza `canonical`, `og:url`, `sitemap.xml`
  y las URLs de los datos estructurados.
