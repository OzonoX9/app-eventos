"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export const PANELES = [
  { id: "inicio", nombre: "Inicio" },
  { id: "ubicacion", nombre: "Ubicación" },
  { id: "croquis", nombre: "Croquis" },
  { id: "stands", nombre: "Stands" },
  { id: "organizador", nombre: "Organizador" },
] as const;

export default function HomePanels({ header, children }: { header: ReactNode; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLElement>(null);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const pagina = root.current;
    const deck = pagina?.querySelector<HTMLElement>(".home-panels");
    if (!pagina || !deck) return;
    const paneles = Array.from(deck.querySelectorAll<HTMLElement>(":scope > [data-panel]"));
    const mobile = window.matchMedia("(max-width: 760px)");
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    let limpiar = () => {};

    function configurar() {
      limpiar();
      if (!mobile.matches) return;
      let actual = paneles.find((p) => p.dataset.panel === window.location.hash.slice(1)) ?? paneles[0];
      const alinear = () => {
        if (actual) deck!.scrollTo({ left: actual.offsetLeft, behavior: "instant" });
      };
      alinear();

      function ir(id: string) {
        const destino = paneles.find((p) => p.dataset.panel === id);
        if (!destino) return;
        actual = destino;
        destino.scrollTop = 0;
        deck!.scrollTo({ left: destino.offsetLeft, behavior: reducido.matches ? "instant" : "smooth" });
        if (window.location.hash !== `#${id}`) window.history.pushState(window.history.state, "", `#${id}`);
      }

      const observer = new IntersectionObserver((entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting || entrada.intersectionRatio < 0.6) continue;
          const panel = entrada.target as HTMLElement;
          actual = panel;
          const indice = PANELES.findIndex((p) => p.id === panel.dataset.panel);
          if (indice < 0) continue;
          setActivo(indice);
          const id = PANELES[indice].id;
          if (window.location.hash !== `#${id}`) window.history.replaceState(window.history.state, "", `#${id}`);
          const enlace = menu.current?.querySelector<HTMLElement>(`a[href="#${id}"]`);
          if (menu.current && enlace) {
            menu.current.scrollTo({ left: enlace.offsetLeft - (menu.current.clientWidth - enlace.offsetWidth) / 2, behavior: "instant" });
          }
        }
      }, { root: deck, threshold: [0.6] });
      paneles.forEach((p) => observer.observe(p));

      const click = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const enlace = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
        const id = enlace?.getAttribute("href")?.slice(1);
        if (!id || !paneles.some((p) => p.dataset.panel === id)) return;
        event.preventDefault();
        ir(id);
      };
      const desdeHash = () => {
        actual = paneles.find((p) => p.dataset.panel === window.location.hash.slice(1)) ?? paneles[0];
        alinear();
      };
      const resize = new ResizeObserver(alinear);
      resize.observe(deck!);
      pagina!.addEventListener("click", click);
      window.addEventListener("hashchange", desdeHash);
      limpiar = () => {
        observer.disconnect();
        resize.disconnect();
        pagina!.removeEventListener("click", click);
        window.removeEventListener("hashchange", desdeHash);
      };
    }

    configurar();
    mobile.addEventListener("change", configurar);
    return () => {
      limpiar();
      mobile.removeEventListener("change", configurar);
    };
  }, []);

  return (
    <div className="home-page" ref={root}>
      {header}
      <nav className="panel-menu" ref={menu} aria-label="Secciones de la portada">
        {PANELES.map((panel, indice) => (
          <a key={panel.id} href={`#${panel.id}`} aria-current={indice === activo ? "location" : undefined}>
            <span aria-hidden="true">{String(indice + 1).padStart(2, "0")}</span> {panel.nombre}
          </a>
        ))}
      </nav>
      {children}
    </div>
  );
}
