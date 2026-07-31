export interface StoredMediaRef {
  assetId?: string;
  path?: string;
  src?: string;
  subtitlePath?: string;
  subtitleSrc?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Encuentra medios en cualquier nivel: portada, noticias, programas o galería. */
export function collectStoredMediaRefs(value: unknown): StoredMediaRef[] {
  const refs: StoredMediaRef[] = [];
  const visited = new Set<object>();

  const visit = (current: unknown) => {
    if (!current || typeof current !== "object" || visited.has(current)) return;
    visited.add(current);

    if (Array.isArray(current)) {
      current.forEach(visit);
      return;
    }

    if (!isRecord(current)) return;
    if (
      typeof current.assetId === "string" ||
      typeof current.path === "string" ||
      typeof current.subtitlePath === "string"
    ) {
      refs.push(current as StoredMediaRef);
    }
    Object.values(current).forEach(visit);
  };

  visit(value);
  return refs;
}
