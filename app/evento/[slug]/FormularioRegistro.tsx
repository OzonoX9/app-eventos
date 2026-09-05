"use client";

import { useState } from "react";
import type { FormularioRegistro as Datos } from "@/lib/types";
import { validarRegistro } from "@/lib/utils";
import { Switch } from "nextjs-darkmode/switch";

const VACIO: Datos = { nombre: "", apellido: "", cedula: "", email: "", direccion: "" };

type Errores = Partial<Record<keyof Datos, string>>;

const CAMPOS: Array<{
  name: keyof Datos;
  label: string;
  type: string;
  placeholder: string;
  inputMode?: "text" | "email" | "numeric";
  autoComplete?: string;
}> = [
  { name: "nombre", label: "Nombre", type: "text", placeholder: "Juan", autoComplete: "given-name" },
  { name: "apellido", label: "Apellido", type: "text", placeholder: "Pérez", autoComplete: "family-name" },
  {
    name: "cedula",
    label: "Número de cédula",
    type: "text",
    placeholder: "1234567",
    inputMode: "numeric",
  },
  {
    name: "email",
    label: "Correo electrónico",
    type: "email",
    placeholder: "juan@correo.com",
    inputMode: "email",
    autoComplete: "email",
  },
  {
    name: "direccion",
    label: "Dirección",
    type: "text",
    placeholder: "Av. Principal 123, Asunción",
    autoComplete: "street-address",
  },
];

export default function FormularioRegistro({ eventoId }: { eventoId: string }) {
  const [datos, setDatos] = useState<Datos>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  function actualizar(campo: keyof Datos, valor: string) {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }));
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorGeneral(null);

    const validacion = validarRegistro(datos);
    if (!validacion.ok) {
      setErrores(validacion.errores);
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch("/api/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventoId, ...validacion.datos }),
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.errores) setErrores(json.errores);
        setErrorGeneral(json.error ?? "No pudimos completar el registro");
        return;
      }

      setListo(true);
    } catch {
      setErrorGeneral("Sin conexión. Revisá tus datos móviles e intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  if (listo) {
    return (
      <div className="tarjeta text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          🎉
        </div>
        <h2 className="text-2xl font-bold text-slate-900">¡Estás participando!</h2>
        <p className="mt-2 text-slate-600">
          Tu registro quedó confirmado. Cada hora sorteamos premios entre los participantes
          registrados, y al final hacemos el gran sorteo. Quedate atento a las pantallas.
        </p>
        <button
          type="button"
          className="boton-secundario mt-6"
          onClick={() => {
            setDatos(VACIO);
            setListo(false);
          }}
        >
          Registrar a otra persona
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="tarjeta space-y-4">
      {CAMPOS.map((campo) => (
        <div key={campo.name}>
          <label className="etiqueta" htmlFor={campo.name}>
            {campo.label}
          </label>
          <input
            id={campo.name}
            name={campo.name}
            type={campo.type}
            inputMode={campo.inputMode}
            autoComplete={campo.autoComplete}
            placeholder={campo.placeholder}
            value={datos[campo.name]}
            onChange={(e) => actualizar(campo.name, e.target.value)}
            aria-invalid={Boolean(errores[campo.name])}
            aria-describedby={errores[campo.name] ? `${campo.name}-error` : undefined}
            className={`campo ${errores[campo.name] ? "campo-error" : ""}`}
          />
          {errores[campo.name] && (
            <p id={`${campo.name}-error`} className="mt-1 text-sm text-red-600">
              {errores[campo.name]}
            </p>
          )}
        </div>
      ))}

      {errorGeneral && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorGeneral}
        </p>
      )}

      <button type="submit" disabled={enviando} className="boton w-full">
        {enviando ? "Registrando…" : "Participar en los sorteos"}
      </button>

      <p className="text-center text-xs text-slate-500">
        Usamos tus datos únicamente para contactarte si ganás un premio.
      </p>
    </form>
  );
}

export function BotonTema() {
  return <Switch size={24} />; // skipSystem para saltar el modo "system"
}
