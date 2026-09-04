# App de Eventos — Registro por QR y Sorteos

Registro de participantes mediante **un solo código QR** y sorteos en vivo: uno por hora
durante el evento y un sorteo final con 30 o 40 premios.

Stack: **Next.js 16 (App Router) · TypeScript · TailwindCSS 4 · Supabase (PostgreSQL) · SWR**

## Cómo funciona

1. Imprimís el QR del evento y lo ponés en la entrada.
2. El participante lo escanea con su celular (funciona con datos móviles) y completa
   nombre, apellido, cédula, correo y dirección.
3. Desde el panel apretás **Sorteo por hora** y al cierre el **Sorteo final**.
4. Los ganadores se proyectan en la vista de pantalla.

## Rutas

- `/` — elegís el nombre del evento y entrás al panel.
- `/evento/[slug]` — formulario público de registro (lo que abre el QR).
- `/evento/[slug]/admin` — panel: QR, métricas, sorteos, historial y export CSV.
- `/evento/[slug]/pantalla` — vista de ganadores para proyectar en una TV.

No hace falta "crear" el evento: el slug de la URL es el identificador.

## Puesta en marcha

### 1. Crear el proyecto en Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá un proyecto (plan gratuito).
2. Abrí **SQL Editor → New query**, pegá el contenido de `supabase/schema.sql` y ejecutalo.
3. Andá a **Project Settings → API** y copiá:
   - **Project URL**
   - **service_role key** (la secreta, no la `anon`)

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Completá `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=una-clave-fuerte
```

### 3. Levantar en local

```bash
npm install
npm run dev
```

Abrí http://localhost:3000.

> Para probar el QR desde el celular en la misma red WiFi:
> `npm run dev -- -H 0.0.0.0` y entrá desde `http://<tu-ip-local>:3000`.
> El QR se genera con el host de la request, así que apunta solo.

### 4. Deploy en Vercel

1. Subí el repo a GitHub.
2. En [vercel.com](https://vercel.com) importá el repo.
3. Cargá las mismas tres variables de entorno en **Settings → Environment Variables**.
4. Deploy. El QR va a apuntar al dominio de producción automáticamente.

## Decisiones de diseño

**Todo el acceso a la base pasa por el servidor.** Las tablas tienen RLS activado y
*sin políticas*, por lo que la `anon key` no puede leer ni escribir nada. Los route
handlers de Next.js usan la `service_role key`, que nunca llega al navegador. Esto evita
que alguien inspeccione la red y descargue la lista completa de participantes.

**Sorteo con `crypto.randomInt`.** Se usa Fisher-Yates con el generador criptográfico de
Node en lugar de `Math.random()`, que es predecible y sesgado. Ver `lib/sorteo.ts`.

**Actualización con SWR.** El panel y la pantalla hacen polling cada 4-5 segundos, que es
más simple y robusto que WebSockets para un evento de unas horas.

**Cédula única por evento.** Un índice único sobre `(evento_id, lower(cedula))` impide
que alguien se registre dos veces para aumentar sus chances.

**Datos enmascarados en público.** El endpoint `/api/sorteos` es público (lo consume la
pantalla) y solo devuelve nombre, apellido y la cédula parcialmente oculta. Correos y
direcciones únicamente los ve el admin autenticado.

## Estructura

```
app/
├── page.tsx                        # home
├── api/
│   ├── registrar/route.ts          # POST público: alta de participante
│   ├── participantes/route.ts      # GET admin: lista + métricas
│   ├── sortear/route.ts            # POST admin: ejecuta el sorteo
│   ├── sorteos/route.ts            # GET público: ganadores enmascarados
│   └── admin/sesion/route.ts       # login / logout
└── evento/[slug]/
    ├── page.tsx                    # formulario de registro
    ├── admin/                      # panel + QR + sorteos
    └── pantalla/                   # vista para proyector
lib/
├── supabase.ts   # cliente service_role (solo servidor)
├── auth.ts       # sesión de admin por cookie httpOnly
├── sorteo.ts     # Fisher-Yates criptográfico
├── utils.ts      # validación, normalización, formato
├── fetcher.ts    # fetcher de SWR
└── base-url.ts   # host real para el QR
supabase/schema.sql
```

## Ideas para seguir

- Cron de Vercel que dispare el sorteo por hora automáticamente.
- Envío de correo al ganador (Resend).
- Animación de "ruleta" en la pantalla antes de revelar el ganador.
- Multi-evento con tabla `eventos` y usuarios de Supabase Auth.
