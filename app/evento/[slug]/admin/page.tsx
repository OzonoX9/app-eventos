import { notFound } from "next/navigation";
import { esAdmin } from "@/lib/auth";
import { obtenerBaseUrl } from "@/lib/base-url";
import { normalizarEventoId } from "@/lib/utils";
import LoginAdmin from "./LoginAdmin";
import PanelAdmin from "./PanelAdmin";

export const metadata = {
  title: "Panel del evento",
  robots: { index: false, follow: false },
};

export default async function PaginaAdmin({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const eventoId = normalizarEventoId(slug);
  if (!eventoId) notFound();

  if (!(await esAdmin())) return <LoginAdmin />;

  const baseUrl = await obtenerBaseUrl();

  return <PanelAdmin eventoId={eventoId} baseUrl={baseUrl} />;
}
