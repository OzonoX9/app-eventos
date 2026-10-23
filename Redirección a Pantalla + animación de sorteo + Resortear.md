# Redirección a Pantalla + animación de sorteo + Resortear
Al presionar "Sorteo por hora" o "Sorteo final" en el panel, hoy el resultado se ve en el propio panel (historial) y la pantalla de proyección (`/evento/[slug]/pantalla`) solo se actualiza sola por polling, sin ningún efecto visual. Se pide: (1) navegar automáticamente a Pantalla al sortear, (2) una animación tipo sorteo que muestre nombres reales cambiando rápido antes de revelar al ganador (el ganador ya se decide en el backend con `crypto.randomInt`, la animación es puramente visual), y (3) un botón "Resortear" en esa misma pantalla.
## Estado actual relevante
* `PanelAdmin.tsx` llama a `POST /api/sortear` y se queda en el panel; "Abrir pantalla" es un link aparte con `target="_blank"`.
* `app/api/sortear/route.ts` ya es admin-only, crea el sorteo + ganadores y devuelve `sorteo.id` en la respuesta.
* `VistaPantalla.tsx` es pública (sin login), hace polling cada 4s a `GET /api/sorteos?evento=X&limit=1` y solo muestra el último sorteo con sus ganadores (nombre, apellido, cédula enmascarada).
* No existe ningún endpoint público con la lista completa de participantes; `GET /api/participantes` (con teléfono/dirección) es admin-only.
* `pantalla/page.tsx` no verifica `esAdmin()` — es 100% pública.
Decisiones ya confirmadas con el usuario:
* Se expondrá públicamente nombre y apellido de **todos** los participantes (sin cédula/teléfono/dirección) para poder animarlos en la pantalla.
* "Resortear" repite la misma configuración del último sorteo (tipo, cantidad, filtros) y agrega un sorteo **nuevo** al historial (no borra el anterior).
* "Resortear" solo debe verse y funcionar si el navegador tiene sesión de admin; para cualquier otro visitante de la pantalla, el botón no aparece.
## Cambios propuestos
### 1. Nuevo endpoint público de nombres
Crear `app/api/participantes-publico/route.ts`: `GET ?evento=slug`, sin `esAdmin()`, devuelve `{ participantes: { id, nombre, apellido }[] }` (mismo patrón que `app/api/sorteos/route.ts` pero sin cédula). Se agrega el tipo `ParticipanteNombre` en `lib/types.ts`.
### 2. Redirección del panel a Pantalla al sortear
En `PanelAdmin.tsx`, la función `sortear()`:
* Antes del POST, guarda en `sessionStorage` (clave `sorteo-config-${eventoId}`) el body exacto enviado (`tipo`, `titulo`, `cantidad`, `excluirGanadores`, `soloUltimaHora`), para que "Resortear" pueda reusarlo.
* Si el POST tiene éxito, en vez de refrescar SWR localmente, navega con `router.push(`/evento/${eventoId}/pantalla?nuevo=${sorteo.id}`)`. El query param `nuevo` le indica a la pantalla que anime justo ese sorteo recién creado (y no uno preexistente).
### 3. Animación en VistaPantalla
`pantalla/page.tsx` pasa dos props nuevas a `VistaPantalla`: `esAdmin` (de `await esAdmin()`) y `sorteoRecienCreado` (de `searchParams.nuevo`, tipado `Promise<{ nuevo?: string }>` igual que ya se hace con `params`). También agrega un link "Volver al panel" visible solo si `esAdmin`.
`VistaPantalla.tsx` se reescribe con una máquina de estados simple (`idle | sorteando | revelado`):
* Trae la lista de nombres con SWR: `GET /api/participantes-publico?evento=eventoId` (refresco cada ~20s, no necesita ser instantáneo).
* Sigue el `id` del último sorteo con un `useRef`. Cuando cambia respecto al valor anterior (o coincide con `sorteoRecienCreado` en el primer render), dispara la animación; si es la primera carga y no coincide con `sorteoRecienCreado`, muestra el resultado directo sin animar (para cuando alguien abre la URL sin pasar por el panel).
* Durante `sorteando`: reemplaza la grilla de ganadores por la misma cantidad de tarjetas (`cantidad_premios`), todas mostrando nombres aleatorios del pool que cambian con un intervalo (con "frenado" progresivo aumentando el delay entre ticks para simular una ruleta deteniéndose) durante ~2.5s. Al terminar, se revela la grilla real (los ganadores ya conocidos, obtenidos de la respuesta de `/api/sorteos`).
* Si el pool de nombres está vacío o aún no cargó, se omite la animación y se revela directo.
### 4. Botón "Resortear"
Visible en `VistaPantalla` solo si `esAdmin` es `true`, deshabilitado mientras hay una animación en curso o una request en vuelo. Al hacer click:
* Lee `sessionStorage` (`sorteo-config-${eventoId}`); si no existe (pantalla abierta directo, sin pasar por el panel), reconstruye un body mínimo desde el sorteo actual: `{ eventoId, tipo: sorteo.tipo, titulo: sorteo.titulo, cantidad: sorteo.cantidad_premios, excluirGanadores: true, soloUltimaHora: false }`.
* Hace `POST /api/sortear` con ese body y, si tiene éxito, llama al `mutate()` de la consulta SWR de sorteos para refrescar de inmediato (el cambio de `id` dispara la animación automáticamente, con la misma lógica del punto 3).
* Maneja errores (ej. sin participantes elegibles) mostrando un mensaje corto en la propia pantalla.
### 5. Documentación
Actualizar el README: nueva sección sobre la animación de sorteo, el endpoint público de nombres y la nota de privacidad (nombre+apellido de todos los participantes queda visible sin login en `/evento/[slug]/pantalla`).
## Notas de alcance
* El spin sincroniza todas las tarjetas a la vez (no hay reels independientes por posición); es un término medio razonable entre esfuerzo y efecto visual — se puede refinar después si se quiere un reveal escalonado por posición.
* No se toca la lógica de selección de ganadores (`lib/sorteo.ts`); la animación es 100% cosmética y corre en el cliente.
