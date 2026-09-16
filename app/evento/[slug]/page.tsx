import { notFound } from "next/navigation";
import LogoEvento, { SponsorsEvento } from "@/app/components/LogoEvento";
import { obtenerLogo, obtenerNombreEvento } from "@/lib/eventos-config";
import { normalizarEventoId } from "@/lib/utils";
import FormularioRegistro from "./FormularioRegistro";

export const metadata = {
  title: "Registro del evento",
  description: "Completá tus datos y participá de los sorteos",
};

export default async function PaginaEvento({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const eventoId = normalizarEventoId(slug);
  if (!eventoId) notFound();

  const nombreEvento = obtenerNombreEvento(eventoId);
  const tieneLogo = obtenerLogo(eventoId) !== null;

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10">
      <header className="mb-6 flex flex-col items-center text-center">
        <LogoEvento eventoId={eventoId} tamano="xl" preload className="mb-6" />

        {/* Con logo el nombre ya se lee ahí, así que pasa a ser un subtítulo. */}
        <p
          className={
            tieneLogo
              ? "text-sm font-semibold uppercase tracking-[0.2em] text-acento"
              : "text-5xl font-semibold uppercase tracking-wide text-acento"
          }
        >
          {nombreEvento}
        </p>

        <h1 className="mt-4 text-2xl font-bold text-foreground">Registrate y participá</h1>
        <p className="mt-2 text-tenue">
          Completá tus datos para entrar en los sorteos por hora y en el sorteo final.
        </p>
      </header>

      <FormularioRegistro eventoId={eventoId} />

      <SponsorsEvento eventoId={eventoId} etiqueta="Con el apoyo de" className="mt-10" />
    </main>
  );
}
