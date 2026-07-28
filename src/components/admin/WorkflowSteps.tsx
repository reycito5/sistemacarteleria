import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AdminIcon } from "./AdminIcon";
import type { AdminIconName } from "@/lib/admin/navigation";

interface Step {
  n: number;
  href: string;
  title: string;
  text: string;
  icon: AdminIconName;
}

/**
 * Los cuatro pasos que recorre cualquier contenido antes de verse en un
 * televisor. Se repite en el panel general y en la guía para que la relación
 * entre módulos quede clara desde cualquier punto del sistema.
 */
export const WORKFLOW: readonly Step[] = [
  {
    n: 1,
    href: "/admin/biblioteca",
    title: "Subir el archivo",
    text: "El video o la imagen entra a la biblioteca. Aquí todavía no se ve en ninguna pantalla.",
    icon: "library",
  },
  {
    n: 2,
    href: "/admin/plantillas",
    title: "Armar la pantalla",
    text: "Se elige una plantilla, se escriben los textos y se le asigna el archivo. Luego se aprueba.",
    icon: "templates",
  },
  {
    n: 3,
    href: "/admin/playlist",
    title: "Publicar la playlist",
    text: "Se ordenan las pantallas aprobadas, se fija cuánto dura cada una y se publica.",
    icon: "playlist",
  },
  {
    n: 4,
    href: "/admin/pantallas",
    title: "Emitir en los televisores",
    text: "Los equipos descargan la programación en menos de un minuto y la emiten sincronizada.",
    icon: "screens",
  },
];

export function WorkflowSteps({ className = "" }: { className?: string }) {
  return (
    <ol className={`grid gap-3 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {WORKFLOW.map((step, i) => (
        <li key={step.n} className="relative">
          <Link
            href={step.href}
            className="group flex h-full flex-col rounded-[14px] border border-ui-border bg-ui-raised p-4 transition hover:border-inst-blue/35 hover:bg-ui-surface hover:shadow-[var(--shadow-ui-sm)]"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-inst-blue-bottom text-[13px] font-black text-inst-white">
                {step.n}
              </span>
              <AdminIcon
                name={step.icon}
                size={16}
                className="text-inst-blue-top/45"
              />
            </div>
            <p className="mt-3 text-sm font-extrabold text-inst-blue-top">
              {step.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ui-muted">
              {step.text}
            </p>
          </Link>

          {i < WORKFLOW.length - 1 && (
            <ChevronRight
              aria-hidden
              size={16}
              className="absolute -right-[11px] top-1/2 hidden -translate-y-1/2 text-ui-border-strong lg:block"
            />
          )}
        </li>
      ))}
    </ol>
  );
}
