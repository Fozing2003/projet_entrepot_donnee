"use client"

import { LayoutDashboard, CalendarRange, MapPinned, Building2, Network, Target, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

export type TabId = "overview" | "temporal" | "geographic" | "agency" | "channels" | "strategy" | "assistant"

const navItems: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Synthèse", icon: LayoutDashboard },
  { id: "temporal", label: "Temporel", icon: CalendarRange },
  { id: "geographic", label: "Géographie", icon: MapPinned },
  { id: "agency", label: "Agences", icon: Building2 },
  { id: "channels", label: "Canaux", icon: Network },
  { id: "strategy", label: "Implantation", icon: Target },
  { id: "assistant", label: "Assistant", icon: Bot },
]

export function Sidebar({
  active,
  onSelect,
}: {
  active: TabId
  onSelect: (id: TabId) => void
}) {
  return (
    <aside className="flex w-16 shrink-0 flex-col items-center gap-2 bg-sidebar py-4 md:w-20">
      <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
        A
      </div>
      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-current={isActive ? "page" : undefined}
              title={label}
              className={cn(
                "group relative flex w-14 flex-col items-center gap-1 rounded-lg py-2.5 text-[10px] font-medium leading-tight text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                isActive && "bg-sidebar-accent text-sidebar-foreground",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
              )}
              <Icon className="size-5" aria-hidden="true" />
              <span className="text-center">{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
