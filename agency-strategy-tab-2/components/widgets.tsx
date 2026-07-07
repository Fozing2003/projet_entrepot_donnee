"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { Kpi, CategoryRow, ZoneRow } from "@/lib/mock-data"
import { formatMilliards, formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

export const CHART_COLORS = ["#1e3a8a", "#3b82f6", "#60a5fa", "#93c5fd", "#c7d7f5", "#1c326f"]

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 12,
} as const

// --- Carte indicateur (KPI) --------------------------------------------------
export function KpiCard({ kpi }: { kpi: Kpi }) {
  const isPositive = kpi.delta >= 0
  const isGood = kpi.positiveIsGood ? isPositive : !isPositive
  const Arrow = isPositive ? ArrowUpRight : ArrowDownRight

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">{kpi.value}</p>
      <div className="mt-3 flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
            isGood ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
          )}
        >
          <Arrow className="size-3.5" aria-hidden="true" />
          {isPositive ? "+" : ""}
          {kpi.delta}%
        </span>
        <span className="text-[11px] text-muted-foreground">{kpi.sublabel}</span>
      </div>
    </div>
  )
}

// --- Conteneur de section ----------------------------------------------------
export function SectionCard({
  title,
  subtitle,
  className,
  children,
}: {
  title: string
  subtitle?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-5 shadow-sm", className)}>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

// --- Histogramme vertical (montant par catégorie, en Md FCFA) ----------------
export function MontantBarChart({
  data,
  dataKey = "montant",
  xKey = "annee",
}: {
  data: Array<Record<string, number | string>>
  dataKey?: string
  xKey?: string
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "rgba(30,58,138,0.06)" }}
            contentStyle={tooltipStyle}
            formatter={(value: number) => [formatMilliards(value), "Montant"]}
          />
          <Bar dataKey={dataKey} fill="#1e3a8a" radius={[3, 3, 0, 0]} maxBarSize={42} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// --- Courbe d'évolution ------------------------------------------------------
export function EvolutionLineChart({
  data,
  xKey = "mois",
  dataKey = "montant",
}: {
  data: Array<Record<string, number | string>>
  xKey?: string
  dataKey?: string
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: number) => [formatMilliards(value), "Montant"]}
          />
          <Line type="monotone" dataKey={dataKey} stroke="#1e3a8a" strokeWidth={2.5} dot={{ r: 3, fill: "#1e3a8a" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// --- Donut (répartition en %) ------------------------------------------------
export function ShareDonut({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}%`} contentStyle={tooltipStyle} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// --- Classement en barres horizontales (montant en Md FCFA) ------------------
export function RankingBarList({ rows }: { rows: Array<CategoryRow | ZoneRow> }) {
  const max = Math.max(...rows.map((r) => r.montant))
  return (
    <ul className="flex flex-col gap-3.5">
      {rows.map((row, i) => (
        <li key={row.libelle}>
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <div className="min-w-0">
              <span className="text-sm font-medium text-foreground">{row.libelle}</span>
              <span className="ml-2 text-xs text-muted-foreground">{row.detail}</span>
            </div>
            <span className="shrink-0 font-mono text-sm font-semibold text-foreground">
              {formatMilliards(row.montant)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(row.montant / max) * 100}%`,
                  backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                }}
              />
            </div>
            <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">
              {formatNumber(row.transactions)} tx
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
