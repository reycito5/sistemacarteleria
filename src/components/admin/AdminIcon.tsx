import {
  CalendarClock,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  LifeBuoy,
  ListVideo,
  MonitorPlay,
  ShieldCheck,
  Siren,
  SquareStack,
  type LucideProps,
} from "lucide-react";
import type { AdminIconName } from "@/lib/admin/navigation";

const ICONS: Record<AdminIconName, React.ComponentType<LucideProps>> = {
  dashboard: LayoutDashboard,
  library: LibraryBig,
  templates: SquareStack,
  playlist: ListVideo,
  calendar: CalendarClock,
  emergency: Siren,
  portal: GraduationCap,
  screens: MonitorPlay,
  security: ShieldCheck,
  help: LifeBuoy,
};

/** Icono del módulo, resuelto por nombre para no acoplar el mapa a lucide. */
export function AdminIcon({
  name,
  ...props
}: { name: AdminIconName } & LucideProps) {
  const Icon = ICONS[name];
  return <Icon aria-hidden {...props} />;
}
