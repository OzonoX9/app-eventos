import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);

function cargarModulo(ruta, dependencias = {}) {
  const filename = fileURLToPath(new URL(ruta, import.meta.url));
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const contexto = {
    exports: {},
    require: (id) => dependencias[id] ?? require(id),
  };
  vm.runInNewContext(outputText, contexto, { filename });
  return contexto.exports;
}

const { evento, obtenerStandsDelMapa } = cargarModulo("../lib/evento.ts");
const { default: HomePanels, PANELES } = cargarModulo("../app/components/HomePanels.tsx");

function renderizar(configuracion = evento) {
  const { default: Home } = cargarModulo("../app/page.tsx", {
    "@/lib/evento": { evento: configuracion },
    "@/app/components/HomePanels": { default: HomePanels },
    "next/image": {
      __esModule: true,
      default: ({ src, alt, width, height, sizes, className }) =>
        createElement("img", { src, alt, width, height, sizes, className }),
    },
  });
  return renderToStaticMarkup(createElement(Home));
}

test("muestra las dos secciones pendientes sin inventar stands ni un croquis", () => {
  const html = renderizar({ ...evento, croquis: null, stands: [] });
  assert.match(html, /id="croquis"/);
  assert.match(html, /id="stands"/);
  assert.match(html, /El croquis estará disponible muy pronto/);
  assert.match(html, /Estamos preparando la lista de stands/);
  assert.ok(!html.includes('class="stand-card"'));
  assert.ok(!html.includes('class="venue-plan-figure"'));
});

test("Km 13 y Ka'arendy tienen sus flyers y los cinco stands cuentan con menú en imagen", async () => {
  assert.ok(evento.stands.every((stand) => stand.flyer));
  assert.equal(evento.stands.find((stand) => stand.id === "kaarendy").nombre, "Ka'arendy");
  for (const [id, src] of [
    ["pirapo-km-13", "/flyers/pirapo-km-13.jpeg"],
    ["kaarendy", "/flyers/kaarendy.jpeg"],
  ]) {
    const stand = evento.stands.find((s) => s.id === id);
    assert.equal(stand.flyer.src, src);
    const archivo = fileURLToPath(new URL(`../public${src}`, import.meta.url));
    const metadata = await require("sharp")(archivo).metadata();
    assert.equal(metadata.width, stand.flyer.ancho);
    assert.equal(metadata.height, stand.flyer.alto);
    assert.match(stand.flyer.alt, /sin precios/);
  }
  const html = renderizar();
  assert.ok(html.includes("Ka&#x27;arendy"));
  assert.match(html, /href="\/stands\/kaarendy"/);
});

test("Acacaraya y Pirapó Centro tienen sus flyers con dimensiones correctas", async () => {
  for (const [id, src] of [
    ["acacaraya", "/flyers/acacaraya.webp"],
    ["pirapo-centro", "/flyers/pirapo-centro.jpeg"],
  ]) {
    const stand = evento.stands.find((s) => s.id === id);
    assert.ok(stand.flyer);
    assert.equal(stand.flyer.src, src);
    const archivo = fileURLToPath(new URL(`../public${src}`, import.meta.url));
    const metadata = await require("sharp")(archivo).metadata();
    assert.equal(metadata.width, stand.flyer.ancho);
    assert.equal(metadata.height, stand.flyer.alto);
    assert.match(stand.flyer.alt, /sin precios/);
  }
});

test("estacionamientos se muestra plegado debajo del botón de ubicación con los tres enlaces facilitados", () => {
  const html = renderizar();
  const parking = html.match(/<details class="parking-options[^"]*"[^>]*>[\s\S]*?<\/details>/)?.[0];
  assert.ok(parking);
  assert.ok(!/^<details[^>]*\sopen/.test(parking));
  assert.match(parking, /Opciones de estacionamiento/);
  assert.ok(html.indexOf(parking) > html.indexOf("Ver ubicación en Google Maps"));
  const opciones = [
    ["Cancha de Fútbol Asociación Japonesa", "https://maps.app.goo.gl/NtNdv38MHT8m7nyn8"],
    ["Salón Barrio Obrero", "https://maps.app.goo.gl/DWVKxjiUbjmTVsph6"],
    ["Cuartel de Bomberos K109", "https://maps.app.goo.gl/kXKcFmscgSKQq5ii7"],
  ];
  assert.equal([...parking.matchAll(/<li>/g)].length, 3);
  for (const [nombre, url] of opciones) {
    assert.ok(parking.includes(nombre));
    const enlace = [...parking.matchAll(/<a\b[^>]*>/g)].find(([tag]) => tag.includes(`href="${url}"`));
    assert.ok(enlace);
    assert.match(enlace[0], /target="_blank"/);
    assert.match(enlace[0], /rel="noopener noreferrer"/);
  }
});

test("la portada muestra solo los cinco stands nombrados en una lista colapsable", () => {
  assert.equal(evento.stands.length, 5);
  assert.equal(new Set(evento.stands.map((stand) => stand.id)).size, 5);
  const colores = {
    "Pirapó Km 23": "amarillo", "Pirapó Centro": "verde", "Pirapó Km 13": "rojo",
    Acacaraya: "blanco", "Ka'arendy": "morado",
  };
  for (const stand of evento.stands) {
    assert.equal(stand.color, colores[stand.nombre]);
    assert.ok(stand.ubicacion);
    assert.ok(!stand.pendiente);
    assert.equal(stand.descripcion, undefined);
  }
  const html = renderizar();
  assert.equal([...html.matchAll(/<details class="stand-item"/g)].length, 5);
  assert.equal([...html.matchAll(/Color en el croquis:/g)].length, 5);
  assert.equal([...html.matchAll(/href="\/stands\//g)].length, 5);
  assert.ok(!html.includes('class="stand-card"'));
  assert.ok(!html.includes("Stand de alquiler"));
  assert.ok(!/<details class="stand-item"[^>]*\sopen/.test(html));
  assert.match(html, /todavía no tienen flyer muestran un menú de ejemplo, no oficial/);
});

test("incluye el texto de Instagram, las cuatro propuestas y el organizador", () => {
  const html = renderizar();
  assert.ok(html.includes(evento.lema));
  assert.ok(html.includes(evento.invitacion));
  for (const experiencia of evento.experiencias) {
    assert.ok(html.includes(experiencia.titulo));
  }
  assert.ok(html.includes("Nikkai Seinen Pirapó"));
  assert.ok(html.includes("@nikkaiseinen_pirapo"));
  assert.ok(html.includes(`href="${evento.organizador.url}"`));
});

test("presenta el croquis y los stands cuando se cargan datos confirmados", () => {
  const html = renderizar({
    ...evento,
    croquis: { src: "/croquis-prueba.png", alt: "Croquis de prueba", ancho: 1600, alto: 900 },
    stands: [
      {
        id: "prueba-completo",
        nombre: "Stand de prueba completo",
        categoria: "Categoría de prueba",
        descripcion: "Descripción de prueba",
        ubicacion: "Puesto 01",
        instagram: "https://www.instagram.com/stand_prueba/",
        flyer: { src: "/flyers/stand-prueba.png", alt: "Flyer de prueba", ancho: 720, alto: 1280 },
      },
      { id: "prueba-minimo", nombre: "Stand de prueba mínimo", categoria: "Otra categoría" },
    ],
  });
  assert.match(html, /src="\/croquis-prueba.png"/);
  assert.match(html, /alt="Croquis de prueba"/);
  assert.match(html, /aria-label="Abrir el croquis del evento en tamaño completo"/);
  assert.match(html, /Stand de prueba completo/);
  assert.match(html, /Descripción de prueba/);
  assert.match(html, /href="\/stands\/prueba-completo"/);
  assert.match(html, /Puesto 01/);
  assert.match(html, /href="https:\/\/www.instagram.com\/stand_prueba\/"/);
  assert.match(html, /Stand de prueba mínimo/);
  assert.ok(!html.includes("El croquis estará disponible muy pronto"));
  assert.ok(!html.includes("Estamos preparando la lista de stands"));
});

test("la portada tiene siete paneles y conserva fecha, cierre y pie de página", () => {
  const html = renderizar();
  const ids = [...html.matchAll(/data-panel="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, 7);
  assert.equal(ids.join(","), Array.from(PANELES, (p) => p.id).join(","));
  assert.match(html, /aria-label="Secciones de la portada"/);
  assert.equal(ids.join(","), "inicio,ubicacion,croquis,stands,programa,patrocinadores,organizador");
  assert.ok(!html.includes('class="panel-controls"'));
  assert.ok(!html.includes('aria-label="Sección anterior"'));
  assert.ok(!html.includes('aria-label="Sección siguiente"'));
  assert.ok(!html.includes("Deslizá para cambiar de sección"));
  assert.ok(!html.includes('class="location-poster"'));
  assert.match(html, /Ver ubicación en Google Maps/);
  assert.match(html, /class="date-band"/);
  assert.match(html, /class="closing"/);
  assert.match(html, /class="site-footer"/);
});

test("todos los enlaces internos apuntan a un identificador existente", () => {
  const html = renderizar();
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(target), `Ancla inexistente: ${target}`);
  }
});

test("solo los cinco stands nombrados tienen zona interactiva y las coordenadas están dentro del croquis", () => {
  const stands = obtenerStandsDelMapa();
  assert.equal(stands.length, 5);
  for (const stand of stands) {
    assert.ok(!stand.pendiente);
    assert.ok(!stand.id.startsWith("alquiler-"));
    const { x, y, ancho, alto } = stand.puntoMapa;
    assert.ok(x >= 0 && y >= 0 && ancho > 0 && alto > 0);
    assert.ok(x + ancho <= 100 && y + alto <= 100);
  }
  assert.equal(obtenerStandsDelMapa([{
    id: "alquiler-prueba", nombre: "Alquiler de prueba", categoria: "Alquiler",
    pendiente: true, puntoMapa: { x: 10, y: 10, ancho: 10, alto: 10 },
  }]).length, 0);
  const html = renderizar();
  const enlaceMapa = [...html.matchAll(/<a\b[^>]*>/g)].find(([tag]) => tag.includes('href="/mapa"'));
  assert.ok(enlaceMapa);
  assert.match(enlaceMapa[0], /target="_blank"/);
  assert.equal([...html.matchAll(/href="\/stands\//g)].length, 5);
  assert.ok(!html.includes('href="/stands/alquiler-'));
});

test("las páginas de stand muestran flyer si existe y menú de muestra si falta", async () => {
  const { menuEjemplo } = cargarModulo("../lib/menu-ejemplo.ts");
  const pagina = cargarModulo("../app/stands/[id]/page.tsx", {
    "@/lib/evento": { obtenerStandsDelMapa },
    "@/lib/menu-ejemplo": { menuEjemplo },
    "next/image": {
      __esModule: true,
      default: ({ src, alt, width, height, className }) => createElement("img", { src, alt, width, height, className }),
    },
    "@/app/mapa/mapa.module.css": { default: new Proxy({}, { get: (_, key) => key }) },
    "next/navigation": { notFound: () => { throw new Error("NOT_FOUND"); } },
  });
  assert.equal(pagina.dynamicParams, false);
  assert.equal(pagina.generateStaticParams().length, 5);
  for (const stand of obtenerStandsDelMapa()) {
    const params = Promise.resolve({ id: stand.id });
    const html = renderToStaticMarkup(await pagina.default({ params }));
    assert.ok(html.replaceAll("&#x27;", "'").includes(stand.nombre));
    assert.match(html, /href="\/mapa#stand-/);
    if (stand.flyer) {
      assert.ok(html.includes(`src="${stand.flyer.src}"`));
      assert.ok(html.replaceAll("&#x27;", "'").includes(stand.flyer.alt));
      assert.ok(html.includes(`href="${stand.flyer.src}"`));
      assert.match(html, /aria-label="Abrir flyer de [^"]+ en tamaño completo"/);
      assert.ok(!html.includes("Menú de ejemplo — no es el menú oficial"));
      assert.ok(!html.includes("MENÚ ILUSTRATIVO"));
      assert.ok(!html.includes("Sin precio"));
    } else {
      assert.match(html, /Menú de ejemplo — no es el menú oficial/);
      for (const plato of menuEjemplo) assert.ok(html.includes(plato.nombre));
    }
  }
  await assert.rejects(() => pagina.default({ params: Promise.resolve({ id: "alquiler-1" }) }), /NOT_FOUND/);
  await assert.rejects(() => pagina.default({ params: Promise.resolve({ id: "inexistente" }) }), /NOT_FOUND/);
});

test("el mapa conserva los cinco enlaces sin barra ni controles de zoom", () => {
  const { default: Mapa } = cargarModulo("../app/mapa/MapaInteractivo.tsx", {
    "./mapa.module.css": { default: new Proxy({}, { get: (_, key) => key }) },
    "next/image": {
      __esModule: true,
      default: ({ src, alt, width, height }) => createElement("img", { src, alt, width, height }),
    },
  });
  const html = renderToStaticMarkup(createElement(Mapa, {
    croquis: evento.croquis,
    stands: obtenerStandsDelMapa(),
  }));
  assert.ok(!html.includes("<button"));
  assert.ok(!html.includes("<output"));
  assert.ok(!html.includes("Ampliá para ver los detalles"));
  assert.ok(!html.includes("Ajustar a pantalla"));
  assert.equal([...html.matchAll(/data-stand=/g)].length, 5);
});

test("el croquis publicado existe y conserva sus dimensiones y enlace a tamaño completo", () => {
  assert.ok(evento.croquis);
  const imagen = readFileSync(new URL(`../public${evento.croquis.src}`, import.meta.url));
  assert.equal(imagen.subarray(1, 4).toString(), "PNG");
  assert.equal(imagen.readUInt32BE(16), evento.croquis.ancho);
  assert.equal(imagen.readUInt32BE(20), evento.croquis.alto);
  const html = renderizar();
  assert.ok(html.includes(`src="${evento.croquis.src}"`));
  assert.ok(html.includes(`href="${evento.croquis.src}"`));
  assert.ok(html.includes(evento.croquis.alt));
  assert.ok(!html.includes("El croquis estará disponible muy pronto"));
});


test("el flyer de Km 23 existe, es una imagen JPEG y tiene sus dimensiones reales", async () => {
  const stand = evento.stands.find((s) => s.id === "pirapo-km-23");
  assert.ok(stand.flyer);
  const archivo = fileURLToPath(new URL(`../public${stand.flyer.src}`, import.meta.url));
  const imagen = readFileSync(archivo);
  assert.equal(imagen.readUInt16BE(0), 0xffd8);
  const metadata = await require("sharp")(archivo).metadata();
  assert.equal(metadata.width, stand.flyer.ancho);
  assert.equal(metadata.height, stand.flyer.alto);
  assert.match(stand.flyer.alt, /ramen/);
  assert.match(stand.flyer.alt, /sin precios/);
});
