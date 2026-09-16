import { notFound } from "next/navigation";
import LogoEvento, { SponsorsEvento } from "@/app/components/LogoEvento";
import { normalizarEventoId } from "@/lib/utils";
import VistaPantalla from "./VistaPantalla";

export const metadata = {
  title: "Ganadores",
  robots: { index: false, follow: false },
};

export default async function PaginaPantalla({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const eventoId = normalizarEventoId(slug);
  if (!eventoId) notFound();

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background px-8 py-10">
      <LogoEvento eventoId={eventoId} tamano="lg" preload className="mx-auto shrink-0" />

      <div className="flex flex-1 items-center justify-center py-8">
        <VistaPantalla eventoId={eventoId} />
      </div>

      <SponsorsEvento
        eventoId={eventoId}
        tamano="lg"
        etiqueta="Con el apoyo de"
        className="shrink-0"
      />
    </main>
  );
}
