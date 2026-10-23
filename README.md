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

### Croquis y stands

El croquis y la lista de stands tienen secciones propias con avisos de información pendiente. No se muestran puestos ni distribuciones ficticias.

Para incorporar el croquis, guardar la imagen en `public/` y completar `evento.croquis` en `lib/evento.ts` con `src` (ruta pública), `alt` (descripción accesible), `ancho` y `alto` (dimensiones reales). La imagen se adapta al ancho disponible y puede abrirse en tamaño completo. Mantener `null` hasta tener el recurso definitivo.

Para incorporar stands, completar `evento.stands` con `id` único, `nombre` y `categoria`. Cada stand admite también `descripcion`, `ubicacion` (referencia al croquis) e `instagram` (URL completa). Mantener el array vacío hasta confirmar los participantes.

El organizador es Nikkai Seinen Pirapó y su enlace oficial es https://www.instagram.com/nikkaiseinen_pirapo/. El perfil se enlaza sin cargar contenido ni rastreadores de Instagram en la página.

## Validación

`npm test`, `npm run lint`, `npm run typecheck`, `npm run build`. Las pruebas cubren el contenido de Instagram, los estados pendientes, el croquis y los stands con datos de prueba y los enlaces internos.

## Vercel

Se mantiene la vinculación local `.vercel` al proyecto existente para reutilizar su dirección de producción `.vercel.app`. No borrar ni renombrar ese proyecto. Antes de publicar, verificar en Vercel el repositorio y la rama de producción vinculados, y retirar las variables antiguas de base de datos cuando se apruebe el cambio. Esta transformación local no publica por sí misma ningún despliegue.

## Portfolio y datos anteriores

La demo independiente está en `../app-eventos-portfolio`: usa datos ficticios locales y no hereda credenciales ni la vinculación Vercel. No confundir su futuro despliegue con el del evento.

Las variables locales antiguas se preservaron en `../.app-eventos-private-backup/.env.local`, fuera de ambos proyectos y con permisos privados. No subirlas al repositorio. La base de datos remota no fue modificada ni eliminada. El historial del proyecto original sigue en Git.
