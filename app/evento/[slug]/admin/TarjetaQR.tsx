"use client";

import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

/**
 * Muestra el único QR del evento. `baseUrl` viene del servidor (headers de la
 * request), así el QR apunta al host real: localhost, la IP de la red local
 * o el dominio de producción.
 */
export default function TarjetaQR({
  eventoId,
  baseUrl,
}: {
  eventoId: string;
  baseUrl: string;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [copiado, setCopiado] = useState(false);

  const url = `${baseUrl}/evento/${eventoId}`;

  function descargar() {
    const canvas = contenedor.current?.querySelector("canvas");
    if (!canvas) return;
    const enlace = document.createElement("a");
    enlace.download = `qr-${eventoId}.png`;
    enlace.href = canvas.toDataURL("image/png");
    enlace.click();
  }

  async function copiar() {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <section className="tarjeta">
      <h2 className="text-lg font-semibold text-slate-900">QR de ingreso</h2>
      <p className="mt-1 text-sm text-slate-600">
        Imprimilo y ponelo en la entrada. Un solo QR para todo el evento.
      </p>

      <div ref={contenedor} className="mt-4 flex justify-center rounded-xl bg-white p-4">
        <QRCodeCanvas value={url} size={220} level="M" marginSize={2} />
      </div>

      <p className="mt-3 break-all text-center font-mono text-xs text-slate-500">{url}</p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={descargar} className="boton-secundario">
          Descargar PNG
        </button>
        <button type="button" onClick={copiar} className="boton-secundario">
          {copiado ? "¡Copiado!" : "Copiar link"}
        </button>
      </div>
    </section>
  );
}
