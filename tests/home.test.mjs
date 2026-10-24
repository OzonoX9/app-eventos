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

test("la lista provisional incluye cinco stands con su color y nueve alquileres por definir", () => {
  const identificados = evento.stands.filter((stand) => !stand.pendiente);
  const alquileres = evento.stands.filter((stand) => stand.pendiente);
  assert.equal(identificados.length, 5);
  assert.equal(alquileres.length, 9);
  assert.equal(new Set(evento.stands.map((stand) => stand.id)).size, 14);
  const colores = {
    "Pirapó Km 23": "amarillo",
    "Pirapó Centro": "verde",
    "Pirapó Km 13": "rojo",
    Acacaraya: "blanco",
    "Ca'arendy": "morado",
  };
  for (const stand of identificados) {
    assert.equal(stand.color, colores[stand.nombre]);
    assert.ok(stand.ubicacion);
    assert.equal(stand.descripcion, undefined);
  }
  for (const stand of alquileres) {
    assert.equal(stand.color, undefined);
    assert.equal(stand.ubicacion, undefined);
    assert.equal(stand.descripcion, undefined);
  }
  const html = renderizar();
  assert.equal([...html.matchAll(/class="stand-card"/g)].length, 14);
  assert.equal([...html.matchAll(/class="stand-pending-tag"/g)].length, 9);
  assert.equal([...html.matchAll(/Color en el croquis:/g)].length, 5);
  assert.match(html, /LISTADO PROVISIONAL/);
  assert.match(html, /Los menús de los distintos stands todavía no están disponibles/);
  assert.match(html, /no indica una posición en el croquis/);
  assert.match(html, /Stand de alquiler 09/);
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
      },
      { id: "prueba-minimo", nombre: "Stand de prueba mínimo", categoria: "Otra categoría" },
    ],
  });
  assert.match(html, /src="\/croquis-prueba.png"/);
  assert.match(html, /alt="Croquis de prueba"/);
  assert.match(html, /Ver en tamaño completo/);
  assert.match(html, /Stand de prueba completo/);
  assert.match(html, /Descripción de prueba/);
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
  assert.match(html, /aria-label="Sección anterior"/);
  assert.match(html, /aria-label="Sección siguiente"/);
  assert.match(html, /Deslizá para cambiar de sección/);
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

test("los cinco menús estáticos muestran contenido de muestra y los alquileres no tienen página", async () => {
  const { menuEjemplo } = cargarModulo("../lib/menu-ejemplo.ts");
  const pagina = cargarModulo("../app/stands/[id]/page.tsx", {
    "@/lib/evento": { obtenerStandsDelMapa },
    "@/lib/menu-ejemplo": { menuEjemplo },
    "@/app/mapa/mapa.module.css": { default: new Proxy({}, { get: (_, key) => key }) },
    "next/navigation": { notFound: () => { throw new Error("NOT_FOUND"); } },
  });
  assert.equal(pagina.dynamicParams, false);
  assert.equal(pagina.generateStaticParams().length, 5);
  for (const stand of obtenerStandsDelMapa()) {
    const params = Promise.resolve({ id: stand.id });
    const html = renderToStaticMarkup(await pagina.default({ params }));
    assert.ok(html.replaceAll("&#x27;", "'").includes(stand.nombre));
    assert.match(html, /Menú de ejemplo — no es el menú oficial/);
    assert.match(html, /href="\/mapa#stand-/);
    for (const plato of menuEjemplo) assert.ok(html.includes(plato.nombre));
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
