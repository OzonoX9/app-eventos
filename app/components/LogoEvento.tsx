import Image from "next/image";
import { obtenerLogo, obtenerSponsors, type Logo } from "@/lib/eventos-config";

type Tamano = "sm" | "md" | "lg" | "xl";

/** Alto visible. El ancho sale solo (w-auto) para respetar la proporción. */
const ALTURA: Record<Tamano, string> = {
  sm: "h-10",
  md: "h-14",
  lg: "h-20 sm:h-24",
  xl: "h-28 sm:h-36",
};

/**
 * Logo del evento. Los logos son de letras blancas, por eso el tema de la app
 * es oscuro y no llevan ningún fondo detrás.
 * Si el evento no tiene logo configurado no renderiza nada.
 */
export default function LogoEvento({
  eventoId,
  tipo = "principal",
  tamano = "lg",
  preload = false,
  className = "",
}: {
  eventoId: string;
  /** "compacto" usa la versión chica (encabezado del panel). */
  tipo?: "principal" | "compacto";
  tamano?: Tamano;
  /** Activar solo si el logo es el elemento más grande arriba del scroll. */
  preload?: boolean;
  className?: string;
}) {
  const logo = obtenerLogo(eventoId, tipo);
  if (!logo) return null;

  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.ancho}
      height={logo.alto}
      preload={preload}
      className={`${ALTURA[tamano]} w-auto object-contain ${className}`}
    />
  );
}

/** Franja de sponsors. No renderiza nada si el evento no tiene sponsors. */
export function SponsorsEvento({
  eventoId,
  tamano = "md",
  etiqueta,
  className = "",
}: {
  eventoId: string;
  tamano?: Tamano;
  etiqueta?: string;
  className?: string;
}) {
  const sponsors = obtenerSponsors(eventoId);
  if (sponsors.length === 0) return null;

  return (
    <div className={className}>
      {etiqueta && (
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-tenue">
          {etiqueta}
        </p>
      )}
      <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        {sponsors.map((sponsor) => (
          <li key={sponsor.src}>
            <Sponsor sponsor={sponsor} tamano={tamano} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Sponsor({ sponsor, tamano }: { sponsor: Logo; tamano: Tamano }) {
  const imagen = (
    <Image
      src={sponsor.src}
      alt={sponsor.alt}
      width={sponsor.ancho}
      height={sponsor.alto}
      className={`${ALTURA[tamano]} w-auto object-contain`}
    />
  );

  if (!sponsor.href) return imagen;

  return (
    <a
      href={sponsor.href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-block transition hover:opacity-80"
    >
      {imagen}
    </a>
  );
}
