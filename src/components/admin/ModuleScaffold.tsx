interface ModuleScaffoldProps {
  title: string;
  phase: string;
  description: string;
  features: string[];
}

/**
 * Andamiaje de módulo del panel. Documenta el alcance de cada módulo (sección
 * 18) mientras se implementa la fase correspondiente. Incluye estado vacío.
 */
export function ModuleScaffold({
  title,
  phase,
  description,
  features,
}: ModuleScaffoldProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-black text-inst-blue-top">{title}</h1>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold text-inst-white"
          style={{ background: "var(--color-inst-gold)" }}
        >
          {phase}
        </span>
      </div>
      <p className="mt-1 max-w-2xl text-sm text-ui-muted">{description}</p>

      <div
        className="mt-6 rounded-md border bg-white p-6"
        style={{ borderColor: "var(--color-ui-border)" }}
      >
        <p className="text-sm font-bold text-ui-ink">Alcance del módulo</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ui-ink">
              <span className="mt-0.5 text-inst-red">›</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
