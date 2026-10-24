
import Image from "next/image";
import Link from "next/link";
import type { Croquis, Stand, ZonaMapa } from "@/lib/evento";
import styles from "./mapa.module.css";

type StandEnMapa = Stand & { puntoMapa: ZonaMapa };

export default function MapaInteractivo({ croquis, stands }: {
  croquis: Croquis;
  stands: StandEnMapa[];
}) {
  return (
    <div className={styles.layout}>
      <section className={styles.mapPanel} aria-label="Croquis interactivo del evento">
        <div className={styles.mapViewport}>
          <div className={styles.mapStage}>
            <Image src={croquis.src} alt={croquis.alt} width={croquis.ancho} height={croquis.alto} sizes="(max-width: 760px) 100vw, 1000px" preload className={styles.mapImage} />
            {stands.map((stand) => (
              <Link
                key={stand.id}
                id={`stand-${stand.id}`}
                data-stand={stand.id}
                href={`/stands/${stand.id}`}
                aria-label={`Ver menú de ejemplo de ${stand.nombre}`}
                className={`${styles.hotspot} ${stand.color ? styles[stand.color] : ""}`}
                style={{ left: `${stand.puntoMapa.x}%`, top: `${stand.puntoMapa.y}%`, width: `${stand.puntoMapa.ancho}%`, height: `${stand.puntoMapa.alto}%` }}
              >
                <span className={styles.hotspotLabel}>{stand.nombre}</span>
                <span className={styles.hotspotBadge} aria-hidden="true"><span className={styles.badgeText}>Menú </span>↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <aside className={styles.legend} aria-labelledby="map-stands-title">
        <p className="eyebrow">ELEGÍ TU PARADA</p>
        <h2 id="map-stands-title">Los cinco stands</h2>
        <p>También podés abrir el menú desde esta lista.</p>
        <ul>
          {stands.map((stand) => (
            <li key={stand.id}>
              <Link href={`/stands/${stand.id}`} className={styles.legendLink}>
                <span className={`${styles.swatch} ${stand.color ? styles[stand.color] : ""}`} aria-hidden="true" />
                <span><strong>{stand.nombre}</strong><small>{stand.color} · Menú de ejemplo</small></span>
                <span aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className={styles.legendNote}>Elegí un stand con nombre para consultar su menú de muestra.</p>
        <a href={croquis.src} target="_blank" rel="noopener noreferrer" className={styles.originalLink}>Abrir croquis original ↗</a>
      </aside>
    </div>
  );
}
