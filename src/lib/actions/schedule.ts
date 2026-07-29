"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getContext, writeAudit, type ActionResult } from "./helpers";
import { getGeneralGroupId } from "@/lib/data/admin";

const scheduleInput = z.object({
  playlistId: z.string().uuid(),
  priority: z.number().int().min(0).max(90).default(50),
  startAt: z.string().nullish(),
  endAt: z.string().nullish(),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).default([]),
  dailyStart: z.string().nullish(),
  dailyEnd: z.string().nullish(),
});

export type ScheduleInput = z.infer<typeof scheduleInput>;

function revalidate() {
  revalidatePath("/admin/calendario");
}

/** Crea una programación de la playlist para el grupo general. */
export async function createSchedule(raw: ScheduleInput): Promise<ActionResult> {
  const parsed = scheduleInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase } = ctx.data;

  const groupId = await getGeneralGroupId();
  if (!groupId) return { ok: false, error: "No existe el grupo general." };

  const { data, error } = await supabase
    .from("schedules")
    .insert({
      playlist_id: d.playlistId,
      screen_group_id: groupId,
      priority: d.priority,
      start_at: d.startAt || null,
      end_at: d.endAt || null,
      days_of_week: d.daysOfWeek,
      daily_start_time: d.dailyStart || null,
      daily_end_time: d.dailyEnd || null,
      active: true,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  await writeAudit(ctx.data, "crear", "schedule", data.id);
  revalidate();
  return { ok: true, data: undefined };
}

export async function toggleSchedule(
  id: string,
  active: boolean,
): Promise<ActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { error } = await ctx.data.supabase
    .from("schedules")
    .update({ active })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidate();
  return { ok: true, data: undefined };
}

export async function deleteSchedule(id: string): Promise<ActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { error } = await ctx.data.supabase.from("schedules").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  await writeAudit(ctx.data, "eliminar", "schedule", id);
  revalidate();
  return { ok: true, data: undefined };
}
