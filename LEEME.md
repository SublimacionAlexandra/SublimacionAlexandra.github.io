# Sublimación Alexandra — sitio corregido

Esta carpeta contiene el sitio listo para subir a GitHub Pages, con las correcciones
aplicadas y la sección de testimonios reemplazada por una de **ubicación con mapa**.

---

## 1. Qué hay en la carpeta

| Archivo | Estado | Para qué sirve |
|---|---|---|
| `index.html` | **reemplaza** al actual | Página completa corregida |
| `style.css` | **reemplaza** al actual | Estilos depurados (sin duplicados) |
| `script.js` | **reemplaza** al actual | Un solo archivo, sin doble carga |
| `og-image.jpg` | **nuevo** | Imagen que sale al compartir el link por WhatsApp/Facebook |
| `favicon.svg` | **nuevo** | Ícono de la pestaña del navegador |
| `favicon-32.png` | **nuevo** | Ícono de respaldo |
| `apple-touch-icon.png` | **nuevo** | Ícono al guardar en el celular |
| `icon-512.png` | **nuevo** | Ícono grande (datos para Google) |
| `robots.txt` | **nuevo** | Permite que Google indexe el sitio |
| `sitemap.xml` | **nuevo** | Mapa del sitio para Google |

Todos van en la **raíz del repositorio**, junto a `index.html`. Las carpetas de
imágenes (`imagenes/`, `tazas/`, `poleras/`, `gorras/`, `productos/`, `galeria/`)
se quedan tal como están: el nuevo HTML usa los mismos nombres de archivo.

---

## 2. Qué borrar del repositorio

| Archivo / carpeta | Por qué |
|---|---|
| `productos.json` | No lo usa ninguna página y sus rutas están mal escritas |
| `galeria/WhatsApp Image 2026-08-02 at 18.40.30 (3).jpeg` | Foto suelta, no se usa, y el nombre con espacios da problemas |
| `clientes/` (carpeta completa) | Ya no hay sección de testimonios; son fotos de personas reales, mejor no dejarlas publicadas |

---

## 3. Cómo subirlo a GitHub (desde el navegador)

1. Entra a `github.com/SublimacionAlexandra/SublimacionAlexandra.github.io`
2. Botón **Add file → Upload files**
3. Arrastra **todos los archivos de esta carpeta** (no la carpeta, los archivos)
4. Escribe el mensaje `Sitio corregido + mapa de ubicación`
5. Botón verde **Commit changes**
6. Espera 1–2 minutos y abre `https://sublimacionalexandra.github.io/`

Los archivos con el mismo nombre se reemplazan solos. Si el navegador no te deja
arrastrar, usa **GitHub Desktop**: copia los archivos en la carpeta local del
repositorio, y luego *Commit* + *Push*.

> Consejo: recarga con **Ctrl + Shift + R** para ver los cambios y no la versión
> guardada en caché.

---

## 4. Lo que tienes que personalizar sí o sí

### a) El mapa con tu dirección exacta
Ahora el mapa apunta al centro de Cuevo. Para que marque tu tienda:

1. Abre Google Maps y busca tu dirección exacta.
2. Clic derecho sobre el punto → copia las coordenadas (ej. `-20.4512,-63.5231`).
3. En `index.html` busca `maps.google.com/maps?q=` y reemplaza
   `Cuevo%2C%20Santa%20Cruz%2C%20Bolivia` por `-20.4512,-63.5231` (tus coordenadas).
4. En el botón "Cómo llegar" cambia también `destination=...` por las mismas coordenadas.

### b) Los precios que dicen "Precio a consultar"
Están en poleras, gorras y más productos. Si prefieres mostrar "Desde 45 Bs" en
lugar de "Precio a consultar", busca en `index.html` la línea:

```html
<div class="precio consultar">Precio a consultar</div>
```

y cámbiala por:

```html
<div class="precio">Desde 45 Bs</div>
```

(quitando la palabra `consultar` para que se vea en dorado y grande).

### c) Los números de las estadísticas
`1.500` productos, `850` clientes y `9` departamentos estaban en el sitio anterior.
Revísalos: si no son reales, cámbialos, porque hoy la gente los lee.

### d) Redes sociales
Los enlaces de Facebook y TikTok se mantuvieron igual. Verifica que abran bien.

---

## 5. Lo más importante que queda pendiente: el peso de las imágenes

El código ya carga las imágenes con `loading="lazy"`, pero **los archivos siguen
pesando lo mismo**: unos 4,9 MB en total. Eso en datos móviles sigue siendo lento.

| Imagen | Peso actual | Bajar a |
|---|---|---|
| `imagenes/banner1.jpg` | 414 KB | ~110 KB |
| `imagenes/banner2.jpg` | 510 KB | ~110 KB |
| `imagenes/banner3.jpg` | 554 KB | ~110 KB |
| `promocion-gorra-cuevo.jpg` | 734 KB | ~150 KB |
| `galeria/trabajo6.jpg` | 353 KB | ~120 KB |
| `gorras/gorra3.jpg` | **4 KB** | reemplazar: se ve borrosa |
| `tazas/taza2.jpg` | **8 KB** | reemplazar: se ve borrosa |

**Cómo hacerlo gratis y sin programas:** entra a `squoosh.app`, arrastra la foto,
elige *Resize* a 1600 px de ancho, formato **WebP** con calidad 80, descarga y sube
el archivo con el mismo nombre. Si quieres que quede en JPG, usa calidad 80 igual.

---

## 6. Si un día quieres dar el siguiente paso

- Un **dominio propio** (`sublimacionalexandra.com`) en lugar de `github.io`:
  se configura en *Settings → Pages → Custom domain* y da mucha más confianza.
- **Google Business Profile**: es lo que hace que aparezcas en el mapa de Google
  cuando alguien busca "sublimación Cuevo". Es gratis y es la mejora con más
  impacto después de esto.
- **Google Search Console**: para ver con qué palabras te encuentran.
