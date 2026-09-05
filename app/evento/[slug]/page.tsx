import { notFound } from "next/navigation";
import { normalizarEventoId } from "@/lib/utils";
import FormularioRegistro, { BotonTema } from "./FormularioRegistro";

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

  const nombreEvento = eventoId.replace(/-/g, " ");

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10">
      {/*<BotonTema />*/}
      <header className="mb-6 text-center">
        <p className="text-5xl font-semibold uppercase tracking-wide text-orange-600">
          {nombreEvento}
        </p>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Registrate y participá</h1>
        <p className="mt-2 text-slate-600">
          Completá tus datos para entrar en los sorteos por hora y en el sorteo final.
        </p>
      </header>

      <FormularioRegistro eventoId={eventoId} />
    </main>
  );
}
