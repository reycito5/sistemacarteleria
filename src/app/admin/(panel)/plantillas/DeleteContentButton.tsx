"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteContentItem } from "@/lib/actions/content";

/** Eliminación con confirmación en dos pasos: no borra al primer clic. */
export function DeleteContentButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = () => {
    setError(null);
    startTransition(async () => {
      const res = await deleteContentItem(id);
      if (!res.ok) {
        setError(res.error);
        setConfirming(false);
      } else {
        router.refresh();
      }
    });
  };

  if (confirming) {
    return (
      <span className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="rounded-[8px] bg-brand-red px-2.5 py-1 text-xs font-bold text-brand-white transition hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "Eliminando…" : "Confirmar"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="rounded-[8px] px-2 py-1 text-xs font-bold text-ui-muted transition hover:text-ui-ink"
        >
          Cancelar
        </button>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-xs font-bold text-brand-red transition hover:bg-danger-soft disabled:opacity-50"
      >
        <Trash2 size={13} aria-hidden />
        Eliminar
      </button>
      {error && (
        <span role="alert" className="text-xs text-brand-red">
          {error}
        </span>
      )}
    </span>
  );
}
