"use client";

import { useEffect, useState } from "react";

const MONTHS_ES = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

function format(now: Date) {
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const time = `${hours}:${minutes} ${meridiem}`;
  const date = `${now.getDate().toString().padStart(2, "0")} ${MONTHS_ES[now.getMonth()]} ${now.getFullYear()}`;
  return { time, date };
}

/**
 * Reloj y fecha institucionales del pie. Se hidrata en el cliente para reflejar
 * la hora local del reproductor; evita desajustes de hidratación mostrando un
 * marcador estable hasta el primer tick.
 */
export function LiveClock({ className = "tabular-nums" }: { className?: string }) {
  const [value, setValue] = useState<{ time: string; date: string } | null>(
    null,
  );

  useEffect(() => {
    const tick = () => setValue(format(new Date()));
    tick();
    const id = setInterval(tick, 1000 * 15);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className}>
      {value ? `${value.time}  ·  ${value.date}` : "—:—  ·  —"}
    </span>
  );
}
