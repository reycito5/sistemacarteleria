import type { GaleriaContent } from "@/lib/views/schemas";
import { CinematicGallery } from "@/components/signage/CinematicGallery";

/**
 * Galería institucional — álbum curado de imágenes que ocupa todo el centro
 * del televisor con estética de reel (Ken Burns + fundido cruzado). La cabecera
 * y el pie institucionales se muestran por su cuenta; aquí sólo va un rótulo
 * discreto con el título del álbum.
 */
export function GaleriaView({ content }: { content: GaleriaContent }) {
  return (
    <div className="relative h-full w-full bg-sig-ink-deep">
      <CinematicGallery images={content.images} seconds={content.seconds} />

      {content.title && (
        <div className="absolute left-[44px] top-[36px] z-[4] inline-flex items-center gap-3 rounded-[4px] bg-sig-ink/80 px-5 py-3 backdrop-blur-sm">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-sig-red" />
          <p className="font-serif text-[30px] font-bold leading-none text-white">
            {content.title}
          </p>
        </div>
      )}
    </div>
  );
}
