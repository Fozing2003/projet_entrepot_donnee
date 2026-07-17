import { useEffect, useState } from "react"
import { SectionCard, MontantBarChart, EvolutionLineChart } from "@/components/widgets"
import { getTemporalData } from "@/lib/dashboard-api"
import type { TemporalData } from "@/lib/dashboard-types"
import { formatNumber } from "@/lib/format"

export function TemporalView() {
  const [data, setData] = useState<TemporalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const temporal = await getTemporalData()
        if (!cancelled) setData(temporal)
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
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SectionCard
              title="Montant total par année"
              subtitle="dim_temps · SUM(montant) en Md FCFA"
              className="lg:col-span-2"
            >
              <MontantBarChart data={data.transactionsByYear} dataKey="montant" xKey="annee" />
            </SectionCard>

            <SectionCard title="Frais générés par année" subtitle="SUM(frais_operation) en Md FCFA">
              <MontantBarChart data={data.transactionsByYear} dataKey="frais" xKey="annee" />
            </SectionCard>
          </div>

          <SectionCard title="Évolution mensuelle de l'activité" subtitle="Montant cumulé par mois (Md FCFA)">
            <EvolutionLineChart data={data.monthlyEvolution} xKey="mois" dataKey="montant" />
          </SectionCard>

          <SectionCard title="Nombre de transactions par année" subtitle="COUNT(Fact_Transactions)">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2.5 pr-4 font-medium">Année</th>
                    <th className="py-2.5 pr-4 text-right font-medium">Montant (Md FCFA)</th>
                    <th className="py-2.5 pr-4 text-right font-medium">Frais (Md FCFA)</th>
                    <th className="py-2.5 text-right font-medium">Nombre de transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactionsByYear.map((row, i) => (
                    <tr key={row.annee} className={i % 2 === 1 ? "bg-muted/40" : undefined}>
                      <td className="py-2.5 pr-4 font-mono text-foreground">{row.annee}</td>
                      <td className="py-2.5 pr-4 text-right font-mono tabular-nums text-foreground">
                        {formatNumber(row.montant)}
                      </td>
                      <td className="py-2.5 pr-4 text-right font-mono tabular-nums text-muted-foreground">
                        {row.frais.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-foreground">
                        {formatNumber(row.transactions)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  )
}
