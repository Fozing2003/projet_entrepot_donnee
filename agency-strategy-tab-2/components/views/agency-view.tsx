import { useEffect, useState } from "react"
import { SectionCard, ShareDonut } from "@/components/widgets"
import { getAgencyData } from "@/lib/dashboard-api"
import type { AgencyData } from "@/lib/dashboard-types"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

export function AgencyView() {
  const [data, setData] = useState<AgencyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const agencyData = await getAgencyData()
        if (!cancelled) setData(agencyData)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Erreur lors du chargement")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {loading && <p className="text-sm text-muted-foreground">Chargement des données...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {data && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SectionCard
            title="Performance des agences"
            subtitle="vue_performance_agence · dim_agence"
            className="lg:col-span-2"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2.5 pr-4 font-medium">Agence</th>
                    <th className="py-2.5 pr-4 font-medium">Type</th>
                    <th className="py-2.5 pr-4 font-medium">Statut</th>
                    <th className="py-2.5 pr-4 text-right font-medium">Montant</th>
                    <th className="py-2.5 pr-4 text-right font-medium">Frais</th>
                    <th className="py-2.5 text-right font-medium">Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.performanceAgences.map((a, i) => (
                    <tr key={a.nom} className={i % 2 === 1 ? "bg-muted/40" : undefined}>
                      <td className="py-2.5 pr-4 font-medium text-foreground">{a.nom}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{a.type}</td>
                      <td className="py-2.5 pr-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                            a.statut === "Active"
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning",
                          )}
                        >
                          {a.statut}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-right font-mono tabular-nums text-foreground">
                        {a.montant} Md
                      </td>
                      <td className="py-2.5 pr-4 text-right font-mono tabular-nums text-muted-foreground">
                        {a.frais.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} Md
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-foreground">
                        {formatNumber(a.transactions)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Répartition par type d'agence" subtitle="Part en %">
            <ShareDonut data={data.agenceByType} />
          </SectionCard>
        </div>
      )}
    </div>
  )
}
