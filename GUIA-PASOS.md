# Guía de tu web — Miguel González · Miguelphoto.ve

## Qué hay en esta carpeta

```
miguelphoto-web/
├── index.html      ← la página completa (textos, fotos, secciones)
├── css/styles.css  ← colores, tipografías y diseño
├── js/main.js      ← interacciones + tu WhatsApp y enlace de Google (arriba del todo)
├── img/            ← logo, favicon e imagen para compartir… y aquí van TUS FOTOS
├── robots.txt      ← permite que Google lea la web
└── sitemap.xml     ← mapa de la web para Google
```

Ya está listo: logo, nombre, WhatsApp, teléfono, Instagram, Google Business, "Quién soy" y
menú (Inicio · Agenda · Servicios · Quién soy · Contacto).

---

## PARTE 1 — Publicar la web (GitHub + Cloudflare)

Con este método, cada vez que subas un cambio a GitHub, Cloudflare actualiza tu web solo.

### A. Subir los archivos a GitHub
1. Entra a github.com → botón verde **New** (o el **+** arriba a la derecha → *New repository*).
2. Nombre: `miguelphoto-ve` · marca **Public** · pulsa **Create repository**.
3. En la página que aparece, haz clic en el enlace **"uploading an existing file"**.
4. Abre la carpeta `miguelphoto-web` en tu Escritorio, selecciona TODO lo que hay dentro
   (Ctrl + A) y arrástralo a GitHub. **Arrastra el contenido, no la carpeta**: `index.html`
   tiene que quedar suelto, no dentro de otra carpeta. (Esta guía no hace falta subirla.)
5. Abajo pulsa **Commit changes** y espera a que termine.

### B. Conectar Cloudflare
1. Entra a dash.cloudflare.com → menú izquierdo **Workers & Pages** → **Create**.
2. Pestaña **Pages** → **Connect to Git** (o *Import an existing Git repository*).
3. Elige **GitHub**, autoriza a Cloudflare y selecciona el repositorio `miguelphoto-ve`.
4. Configuración:
   - **Project name:** `miguelphoto` (será tu dirección miguelphoto.pages.dev)
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** déjalo vacío
   - **Build output directory:** déjalo vacío
5. **Save and Deploy**. En 1–2 minutos tu web estará en línea.
6. Si el nombre `miguelphoto` estaba ocupado, avísame con tu dirección final para ajustar el código.

---

## PARTE 2 — Cómo cambiar, agregar o quitar fotos

### Antes de usar una foto
1. Expórtala a **2000 px** por el lado largo (portada: 2400 px).
2. Conviértela a **WebP** en https://squoosh.app (calidad 75–80). Meta: menos de 400 KB.
3. Ponle un nombre descriptivo, en minúsculas, con guiones y sin acentos ni espacios:
   `boda-caracas-01.webp`, `retrato-estudio-caracas-02.webp`, `doctora-consultorio-caracas.webp`
4. Guárdala dentro de `img/`. Para mantener orden, crea subcarpetas:
   `img/portafolio/`, `img/servicios/`, `img/reels/`

### Cambiar una foto existente
1. Abre la carpeta en Visual Studio Code (**Archivo → Abrir carpeta**) y abre `index.html`.
2. Pulsa **Ctrl + F** y busca `picsum`: cada resultado es una foto de ejemplo.
3. Reemplaza la dirección entre comillas de `src="..."` por la ruta de tu foto. Ejemplo:

   Antes:
   ```html
   <img loading="lazy" src="https://picsum.photos/seed/mp-boda-1/1000/700" alt="Fotografía de boda en Caracas, novios en ceremonia">
   ```
   Después:
   ```html
   <img loading="lazy" src="img/portafolio/boda-caracas-01.webp" alt="Novios saliendo de la iglesia en su boda en Caracas">
   ```
4. Cambia también el `alt="..."`: describe la foto con palabras que la gente buscaría en Google.
5. Guarda con **Ctrl + S** y haz doble clic en `index.html` para ver el resultado en tu navegador.

### Dónde está cada foto (busca este texto con Ctrl + F)
| Foto | Busca |
|---|---|
| Portada grande | `mp-hero` |
| Portafolio (12 fotos) | `mp-est`, `mp-boda`, `mp-15`, `mp-marca`, `mp-med`, `mp-evt` |
| Servicios (6 tarjetas) | `mp-srv-` |
| Sección médicos | `mp-medico-feature` |
| Reels (4 portadas verticales) | `mp-reel-` |
| Tu foto en "Quién soy" | `mp-about-me` |

### Agregar una foto nueva al portafolio
1. Busca `id="gallery"`. Debajo hay una línea `<figure ...>` por cada foto.
2. Copia una línea completa (de `<figure` hasta `</figure>`) y pégala debajo.
3. Cambia:
   - `src` → tu foto
   - `alt` → descripción
   - `data-cat` → categoría para los filtros: `estudio`, `bodas`, `eventos`, `marcas` o `medico`
   - el texto entre `<figcaption>` y `</figcaption>` → el título que aparece al pasar el mouse
   - `class="g-item tall"` para fotos verticales, `class="g-item"` para horizontales

### Quitar una foto
Borra la línea completa de esa foto, desde `<figure` hasta `</figure>`.

### Reels
En la sección `id="reels"`, cambia en cada bloque el `href="..."` por el link de tu reel en
Instagram (en la app: ••• → Copiar enlace) y la imagen por la portada del reel.

---

## PARTE 3 — Subir tus cambios a la web

1. Entra a tu repositorio `miguelphoto-ve` en GitHub.
2. **Si cambiaste textos o `index.html`:** *Add file → Upload files* → arrastra `index.html` → **Commit changes**.
3. **Si agregaste fotos:** entra primero en la carpeta `img` dentro de GitHub (haz clic en ella),
   luego *Add file → Upload files*, arrastra tus fotos (o la subcarpeta `portafolio` completa)
   y **Commit changes**. Sube también el `index.html` actualizado.
4. Cloudflare detecta el cambio y actualiza tu web solo en 1–2 minutos.

> Un archivo con el mismo nombre reemplaza al anterior. Para quitar una foto de GitHub:
> ábrela en GitHub → menú **•••** → **Delete file** → **Commit changes**.

---

## PARTE 4 — Que Google te encuentre (después de publicar)

1. **Google Business:** edita tu perfil → **Sitio web** → pega `https://miguelphoto.pages.dev`.
2. **Google Search Console** (search.google.com/search-console): agrega la propiedad con
   "Prefijo de URL", verifícala (te ayudo con el código) y envía `sitemap.xml`.
3. **Instagram:** pon el link en tu bio.
4. **Reseñas:** pide a 5–8 clientes una reseña con texto en Google. Cuando las tengas, pégalas
   en la sección Testimonios (bloque comentado) y se activa el carrusel.

## Cada mes
- Sube 3–5 fotos nuevas y quita las más débiles.
- Publica tus trabajos también en Google Business.
- Pide reseñas mencionando el servicio ("mis fotos de 15 años en Caracas…").
