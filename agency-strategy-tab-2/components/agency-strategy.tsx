"use client"

import { useState } from "react"
import {
  Target,
  Loader2,
  Wallet,
  ArrowLeftRight,
  Users,
  Smartphone,
  Building2,
  Swords,
  CheckCircle2,
  MinusCircle,
  XCircle,
} from "lucide-react"
import { mockAgencyAnalysis, type AgencyAnalysis, type DecisionCriterion } from "@/lib/mock-data"
import { formatCompactFCFA, formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading"

function getBadge(score: number) {
  if (score >= 75) return { label: "Zone très favorable", className: "bg-success/10 text-success" }
  if (score >= 60) return { label: "Zone favorable", className: "bg-info/10 text-info" }
  if (score >= 45) return { label: "Zone à étudier", className: "bg-warning/10 text-warning" }
  return { label: "Zone non prioritaire", className: "bg-muted text-muted-foreground" }
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const stroke = score >= 75 ? "#16a34a" : score >= 60 ? "#2563eb" : score >= 45 ? "#ea580c" : "#94a3b8"

  return (
    <div className="relative flex size-44 items-center justify-center">
      <svg className="size-44 -rotate-90" viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-4xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wallet
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <p className="mt-3 font-mono text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

const criterionStyle: Record<DecisionCriterion["status"], { icon: typeof CheckCircle2; className: string }> = {
  favorable: { icon: CheckCircle2, className: "text-success" },
  neutre: { icon: MinusCircle, className: "text-warning" },
  defavorable: { icon: XCircle, className: "text-destructive" },
}

export function AgencyStrategy() {
  // États initial / chargement / résultat — remplacer le mock par un appel à l'entrepôt (vues SQL).
  const [status, setStatus] = useState<Status>("idle")
  const [data, setData] = useState<AgencyAnalysis | null>(null)

  const runAnalysis = () => {
    setStatus("loading")
    setData(null)
    // Appel simulé — remplacer par un fetch vers l'API analytique (croisement des vues décisionnelles).
    setTimeout(() => {
      setData(mockAgencyAnalysis)
      setStatus("idle")
    }, 2000)
  }

  const badge = data ? getBadge(data.potentialScore) : null

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Stratégie d'implantation</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Croisement des indicateurs (volume, digital, couverture physique, concurrence) pour identifier la zone
          candidate à l'ouverture d'une nouvelle agence.
        </p>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={runAnalysis}
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Target className="size-4" aria-hidden="true" />
          )}
          {status === "loading" ? "Analyse des zones…" : "Analyser la meilleure zone d'implantation"}
        </button>
      </div>

      {status === "loading" && <ResultSkeleton />}

      {status === "idle" && data && badge && (
        <article className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Target className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{data.areaName}</h3>
                <p className="text-xs text-muted-foreground">Zone recommandée pour une nouvelle agence</p>
              </div>
            </div>
            <span
              className={cn(
                "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold",
                badge.className,
              )}
            >
              {badge.label}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center">
            <div className="flex flex-col items-center gap-2">
              <ScoreGauge score={data.potentialScore} />
              <p className="text-xs font-medium text-muted-foreground">Score de potentiel</p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <MetricCard icon={Wallet} label="Montant des transactions" value={formatCompactFCFA(data.totalTransactionAmount)} />
              <MetricCard icon={ArrowLeftRight} label="Nombre de transactions" value={formatNumber(data.transactionCount)} />
              <MetricCard icon={Users} label="Clients actifs uniques" value={formatNumber(data.uniqueCustomers)} />
              <MetricCard icon={Smartphone} label="Adoption digitale" value={`${data.digitalAdoptionRate}%`} />
              <MetricCard icon={Building2} label="Agences existantes" value={formatNumber(data.existingBranches)} />
              <MetricCard icon={Swords} label="Concurrents présents" value={formatNumber(data.competitorCount)} />
            </div>
          </div>

          <div className="border-t border-border p-6">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Critères décisionnels</h4>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.criteria.map((c) => {
                const { icon: Icon, className } = criterionStyle[c.status]
                return (
                  <li key={c.label} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <Icon className={cn("mt-0.5 size-4 shrink-0", className)} aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.label}</p>
                      <p className="text-xs text-muted-foreground">{c.detail}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </article>
      )}
    </div>
  )
}

function ResultSkeleton() {
  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="size-10 animate-pulse rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-44 animate-pulse rounded bg-muted" />
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="h-6 w-32 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center">
        <div className="mx-auto size-44 animate-pulse rounded-full bg-muted" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}
