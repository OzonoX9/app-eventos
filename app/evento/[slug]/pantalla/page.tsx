import { notFound } from "next/navigation";
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
    <main className="flex min-h-screen flex-1 items-center justify-center bg-slate-950 px-8 py-12">
      <VistaPantalla eventoId={eventoId} />
    </main>
  );
}
