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

const { evento } = cargarModulo("../lib/evento.ts");

function renderizar(configuracion = evento) {
  const { default: Home } = cargarModulo("../app/page.tsx", {
    "@/lib/evento": { evento: configuracion },
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

test("todos los enlaces internos apuntan a un identificador existente", () => {
  const html = renderizar();
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(target), `Ancla inexistente: ${target}`);
  }
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
