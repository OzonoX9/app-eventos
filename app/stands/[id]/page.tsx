import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerStandsDelMapa } from "@/lib/evento";
import { menuEjemplo } from "@/lib/menu-ejemplo";
import styles from "@/app/mapa/mapa.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return obtenerStandsDelMapa().map((stand) => ({ id: stand.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const stand = obtenerStandsDelMapa().find((s) => s.id === id);
  return {
    title: stand ? `${stand.nombre} — Menú de ejemplo | Natsumatsuri 2026` : "Stand no encontrado",
    robots: { index: false, follow: false },
  };
}

export default async function PaginaMenu({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stand = obtenerStandsDelMapa().find((s) => s.id === id);
  if (!stand) notFound();
  return (
    <main className={`${styles.page} ${styles.menuPage}`}>
      <header className={styles.header}>
        <Link href={`/mapa#stand-${stand.id}`} className={styles.back}>← Volver al mapa</Link>
        <span>NATSUMATSURI · 2026</span>
      </header>
      <aside className={styles.notice}>
        <strong>Menú de ejemplo — no es el menú oficial.</strong> Estos platos son ficticios para mostrar el diseño. No hay oferta ni precios confirmados para este stand.
      </aside>
      <article className={styles.menuSheet}>
        <div className={styles.menuTop}><span>STAND · {stand.color}</span><span>MUESTRA / 2026</span></div>
        <div className={styles.menuIdentity}>
          <span className={`${styles.swatch} ${stand.color ? styles[stand.color] : ""}`} aria-hidden="true" />
          <p>UNA PARADA EN EL FESTIVAL</p>
          <h1>{stand.nombre}</h1>
          <span className={styles.sampleTag}>MENÚ ILUSTRATIVO</span>
        </div>
        <div className={styles.menuItems}>
          <h2>Sabores para<br /><em>imaginar el encuentro.</em></h2>
          <ul>
            {menuEjemplo.map((plato, i) => (
              <li key={plato.nombre}>
                <span className={styles.itemNumber}>{String(i + 1).padStart(2, "0")}</span>
                <div><span className={styles.itemCategory}>{plato.categoria}</span><h3>{plato.nombre}</h3><p>{plato.descripcion}</p></div>
                <span className={styles.itemPrice}>Sin precio<br />confirmado</span>
              </li>
            ))}
          </ul>
        </div>
        <footer className={styles.menuFooter}>
          <p><strong>Ubicación en el croquis</strong><br />{stand.ubicacion}</p>
          <p>El menú y el flyer oficiales se publicarán cuando estén disponibles.</p>
          <Link href={`/mapa#stand-${stand.id}`}>Volver a explorar el mapa ↗</Link>
        </footer>
      </article>
      <Link href="/#stands" className={styles.originalLink}>Ver todos los stands del evento ↗</Link>
    </main>
  );
}
