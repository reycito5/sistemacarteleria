"use client";

import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical, X } from "lucide-react";
import { Input } from "@/components/ui/Field";

export interface SortableItem {
  id: string;
  contentTitle: string;
  durationSeconds: number;
}

interface SortablePlaylistProps {
  items: SortableItem[];
  disabled: boolean;
  onReorder: (orderedIds: string[]) => void;
  onDurationChange: (itemId: string, seconds: number) => void;
  onRemove: (itemId: string) => void;
}

function Row({
  item,
  index,
  total,
  disabled,
  onMove,
  onDurationChange,
  onRemove,
}: {
  item: SortableItem;
  index: number;
  total: number;
  disabled: boolean;
  onMove: (from: number, to: number) => void;
  onDurationChange: (itemId: string, seconds: number) => void;
  onRemove: (itemId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={[
        "flex items-center gap-2 rounded-[10px] border bg-ui-raised px-2.5 py-2.5",
        isDragging
          ? "z-10 border-brand-ink-soft bg-ui-surface shadow-[var(--shadow-ui-lg)]"
          : "border-ui-border",
      ].join(" ")}
    >
      {/* Asa de arrastre. También accesible por teclado (espacio + flechas). */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        aria-label={`Reordenar ${item.contentTitle}`}
        className="grid h-7 w-6 shrink-0 cursor-grab place-items-center rounded-[6px] text-ui-faint transition hover:bg-ui-canvas hover:text-ui-ink active:cursor-grabbing disabled:opacity-40"
      >
        <GripVertical size={15} aria-hidden />
      </button>

      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-ink-deep text-[11px] font-black text-brand-white">
        {index + 1}
      </span>

      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ui-ink">
        {item.contentTitle}
      </span>

      <span className="flex shrink-0 items-center gap-1">
        <Input
          type="number"
          min={1}
          defaultValue={item.durationSeconds}
          onBlur={(e) => onDurationChange(item.id, Number(e.target.value))}
          className="h-8 w-16 px-2 text-center text-xs"
          aria-label={`Duración de ${item.contentTitle} en segundos`}
        />
        <span className="text-xs text-ui-muted">s</span>
      </span>

      {/* Alternativa a arrastrar, para pantallas táctiles y teclado. */}
      <span className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => onMove(index, index - 1)}
          disabled={disabled || index === 0}
          aria-label={`Subir ${item.contentTitle}`}
          className="grid h-7 w-7 place-items-center rounded-[7px] text-ui-muted transition hover:bg-ui-canvas hover:text-ui-ink disabled:opacity-25"
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          onClick={() => onMove(index, index + 1)}
          disabled={disabled || index === total - 1}
          aria-label={`Bajar ${item.contentTitle}`}
          className="grid h-7 w-7 place-items-center rounded-[7px] text-ui-muted transition hover:bg-ui-canvas hover:text-ui-ink disabled:opacity-25"
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={disabled}
          aria-label={`Quitar ${item.contentTitle}`}
          className="grid h-7 w-7 place-items-center rounded-[7px] text-ui-muted transition hover:bg-danger-soft hover:text-brand-red disabled:opacity-40"
        >
          <X size={14} />
        </button>
      </span>
    </li>
  );
}

/**
 * Orden de reproducción con arrastrar y soltar.
 *
 * El nuevo orden se aplica de inmediato en pantalla (optimista) y se envía al
 * servidor; si la operación falla, el `router.refresh()` del contenedor
 * devuelve la lista al estado real.
 */
export function SortablePlaylist({
  items,
  disabled,
  onReorder,
  onDurationChange,
  onRemove,
}: SortablePlaylistProps) {
  // Orden optimista: se muestra mientras el servidor confirma. Se anota contra
  // la lista del servidor que se estaba viendo al arrastrar, de modo que en
  // cuanto llegan datos nuevos (otro orden, un alta o una baja) el override
  // deja de aplicar por sí solo y manda el servidor.
  const [override, setOverride] = useState<{
    base: string;
    list: SortableItem[];
  } | null>(null);

  const serverKey = items.map((i) => i.id).join("|");
  const order = override?.base === serverKey ? override.list : items;

  const sensors = useSensors(
    // Un umbral de 6 px evita que un clic en los botones inicie un arrastre.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const applyOrder = (next: SortableItem[]) => {
    setOverride({ base: serverKey, list: next });
    onReorder(next.map((i) => i.id));
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    applyOrder(arrayMove(order, from, to));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = order.findIndex((i) => i.id === active.id);
    const to = order.findIndex((i) => i.id === over.id);
    if (from === -1 || to === -1) return;
    applyOrder(arrayMove(order, from, to));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={order.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <ol className="relative space-y-2">
          {order.map((item, i) => (
            <Row
              key={item.id}
              item={item}
              index={i}
              total={order.length}
              disabled={disabled}
              onMove={move}
              onDurationChange={onDurationChange}
              onRemove={onRemove}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}
