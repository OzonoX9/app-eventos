import type { Metadata } from "next";
import Link from "next/link";
import { evento, obtenerStandsDelMapa } from "@/lib/evento";
import MapaInteractivo from "./MapaInteractivo";
import styles from "./mapa.module.css";

export const metadata: Metadata = {
  title: "Mapa interactivo — Natsumatsuri 2026",
  description: "Explorá el croquis de Natsumatsuri y consultá los flyers y menús de los cinco stands identificados.",
};

export default function PaginaMapa() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/#croquis" className={styles.back}>← Volver al festival</Link>
        <span>NATSUMATSURI · 2026</span>
      </header>
      <div className={styles.intro}>
        <p className="eyebrow">EXPLORÁ EL FESTIVAL</p>
        <h1>Tu próxima parada,<br /><em>en el mapa.</em></h1>
        <p>Tocá uno de los cinco stands señalados para consultar su flyer o menú.</p>
      </div>
      <aside className={styles.notice}>
        <strong>Flyers y menús.</strong> Los stands que todavía no tienen su flyer muestran un menú de ejemplo, identificado como ilustrativo.
      </aside>
      {evento.croquis ? (
        <MapaInteractivo croquis={evento.croquis} stands={obtenerStandsDelMapa()} />
      ) : <p>El croquis estará disponible próximamente.</p>}
    </main>
  );
}
