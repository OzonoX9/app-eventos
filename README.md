# Natsumatsuri 2026 — Pirapó

Web informativa de un único evento: sábado 14 de noviembre de 2026, desde las 18:00, en la Cancha de la Asociación Japonesa de Pirapó, Itapúa, Paraguay.

Next.js 16.3.4, React 19, TypeScript y Tailwind 4. No requiere base de datos, cuentas ni variables de entorno.

## Desarrollo

`npm ci` y `npm run dev`. Abrir http://localhost:3000.

Se recomienda Node.js 24 LTS (Node.js 23 del entorno actual genera una advertencia de compatibilidad con una dependencia de ESLint).

## Contenido

- `lib/evento.ts`: información del evento, organizador, Instagram, experiencias, croquis, stands, programa y patrocinadores.
- `app/page.tsx`: estructura y textos editoriales.
- `app/globals.css`: diseño responsive, paleta y animación con soporte para movimiento reducido.
- `public/brand/koi.png`: koi derivado del logo facilitado, sin modificar los originales. Se aisló su color para retirar la tipografía de 2025; el nombre y 2026 se muestran como texto.
- `public/natsumatsuri-2026.ics`: fecha para calendario, 21:00 UTC = 18:00 en Paraguay. Si cambia la fecha, actualizar también este archivo y los textos de fecha en portada y metadatos.
- `app/icon.png`: icono del evento.

El programa detallado y los patrocinadores se muestran como pendientes hasta disponer de información confirmada. El enlace de ubicación abre una búsqueda del recinto en Google Maps, no un pin de coordenadas verificadas. El dibujo de ubicación es ilustrativo.

### Navegación de la portada

En pantallas de hasta 760 px, solo la portada usa siete paneles horizontales con CSS Scroll Snap. Se puede navegar deslizando, desde el menú compacto o con anterior/siguiente. Cada panel largo tiene scroll vertical propio; el último incluye organizadores, cierre y pie de página. Las anclas existentes y el historial siguen funcionando.

`app/components/HomePanels.tsx` sincroniza el panel visible con el menú y la URL; el contenido sigue renderizado en servidor. Las reglas están acotadas a `.home-page`. En escritorio se conserva el flujo vertical. `/mapa` y `/stands/[id]` no usan el contenedor de paneles.

### Croquis y stands

El croquis y la lista de stands tienen secciones propias. Se muestra el plano facilitado y una lista provisional de cinco stands identificados por color y nueve puestos de alquiler por definir.

Para incorporar el croquis, guardar la imagen en `public/` y completar `evento.croquis` en `lib/evento.ts` con `src` (ruta pública), `alt` (descripción accesible), `ancho` y `alto` (dimensiones reales). La imagen se adapta al ancho disponible y puede abrirse en tamaño completo. Mantener `null` hasta tener el recurso definitivo.

Para incorporar stands, completar `evento.stands` con `id` único, `nombre` y `categoria`. Cada stand admite también `descripcion`, `ubicacion` (referencia al croquis) e `instagram` (URL completa). Mantener el array vacío hasta confirmar los participantes.

El organizador es Nikkai Seinen Pirapó y su enlace oficial es https://www.instagram.com/nikkaiseinen_pirapo/. El perfil se enlaza sin cargar contenido ni rastreadores de Instagram en la página.

### Mapa interactivo y menús de muestra

Desde la sección Croquis se abre `/mapa` en una pestaña nueva. Las cinco zonas sobre los stands identificados enlazan a `/stands/[id]`. También se puede navegar desde la lista junto al plano o desde las tarjetas de la portada. Los nueve alquileres no son interactivos ni tienen página de menú.

`puntoMapa` en `lib/evento.ts` define `x`, `y`, `ancho` y `alto` en porcentajes del croquis completo, sin recorte. Si cambia el plano, revisar estas coordenadas. El mapa se ajusta al ancho disponible sin barra de zoom ni desplazamiento interno; también se puede elegir un stand desde la lista o abrir el croquis original.

Los platos de `lib/menu-ejemplo.ts` son ilustrativos y comunes a los cinco stands, sin precios confirmados. Cada página advierte que no es un menú oficial y permite volver a su posición en el mapa. Las páginas de muestra tienen `noindex` para evitar presentarlas como ofertas definitivas en buscadores.

## Validación

`npm test`, `npm run lint`, `npm run typecheck`, `npm run build`. Las pruebas cubren el contenido de Instagram, los estados pendientes, el croquis y los stands con datos de prueba y los enlaces internos.

## Vercel

Se mantiene la vinculación local `.vercel` al proyecto existente para reutilizar su dirección de producción `.vercel.app`. No borrar ni renombrar ese proyecto. Antes de publicar, verificar en Vercel el repositorio y la rama de producción vinculados, y retirar las variables antiguas de base de datos cuando se apruebe el cambio. Esta transformación local no publica por sí misma ningún despliegue.

## Portfolio y datos anteriores

La demo independiente está en `../app-eventos-portfolio`: usa datos ficticios locales y no hereda credenciales ni la vinculación Vercel. No confundir su futuro despliegue con el del evento.

Las variables locales antiguas se preservaron en `../.app-eventos-private-backup/.env.local`, fuera de ambos proyectos y con permisos privados. No subirlas al repositorio. La base de datos remota no fue modificada ni eliminada. El historial del proyecto original sigue en Git.
