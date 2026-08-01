import { viewContentSchema, type ViewContent } from "@/lib/views/schemas";

function clockSeconds(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/** Duración inicial razonable al añadir una pieza a la playlist. */
export function suggestedContentDuration(value: unknown): number {
  const parsed = viewContentSchema.safeParse(value);
  if (!parsed.success) return 20;
  const content: ViewContent = parsed.data;

  if (content.kind === "noticias") {
    return Math.max(
      10,
      content.entries.reduce((total, entry) => {
        if (entry.kind === "video") {
          return total + (clockSeconds(entry.duration) ?? entry.displaySeconds);
        }
        return total + entry.displaySeconds;
      }, 0),
    );
  }

  if (content.kind === "programacion_general") {
    return Math.max(
      10,
      content.programs.reduce((total, program) => total + program.displaySeconds, 0),
    );
  }

  if (content.kind === "galeria") {
    return Math.max(10, content.images.length * content.seconds);
  }

  if (content.kind === "evento_vivo") return 60 * 60;
  if (content.kind === "mensaje" || content.kind === "homenaje") return 35;
  if (content.kind === "comunicado") return 30;
  return 20;
}
