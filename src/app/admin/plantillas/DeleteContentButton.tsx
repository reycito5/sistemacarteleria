"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteContentItem } from "@/lib/actions/content";

export function DeleteContentButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span>
      <button
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const res = await deleteContentItem(id);
            if (!res.ok) setError(res.error);
            else router.refresh();
          });
        }}
        disabled={pending}
        className="text-xs font-bold text-inst-red disabled:opacity-50"
      >
        Eliminar
      </button>
      {error && <span className="ml-2 text-xs text-inst-red">{error}</span>}
    </span>
  );
}
