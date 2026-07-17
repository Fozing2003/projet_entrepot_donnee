import { useEffect, useState } from "react"
import { KpiCard, SectionCard, MontantBarChart, ShareDonut } from "@/components/widgets"
import { DataTable } from "@/components/data-table"
import { getOverviewData } from "@/lib/dashboard-api"
import type { OverviewData } from "@/lib/dashboard-types"
import { formatAmount } from "@/lib/format"

export function OverviewView() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const overview = await getOverviewData()
        if (!cancelled) setData(overview)
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

  const kpis = data
    ? [
        {
          label: "Montant total des transactions",
          value: `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(data.totals.totalRevenue / 1_000_000_000)} Md FCFA`,
          sublabel: "SUM(montant)",
          delta: 0,
          positiveIsGood: true,
        },
        {
          label: "Total des frais d'opération",
          value: `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(data.totals.totalFees / 1_000_000_000)} Md FCFA`,
          sublabel: "SUM(frais_operation)",
          delta: 0,
          positiveIsGood: true,
        },
        {
          label: "Nombre de transactions",
          value: formatAmount(data.totals.transactionCount),
          sublabel: "COUNT(Fact_Transactions)",
          delta: 0,
          positiveIsGood: true,
        },
        {
          label: "Clients actifs",
          value: formatAmount(data.totals.uniqueCustomers),
          sublabel: "dim_client",
          delta: 0,
          positiveIsGood: true,
        },
      ]
    : []

  return (
    <div className="flex flex-col gap-4">
      {loading && <p className="text-sm text-muted-foreground">Chargement des données...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.label} kpi={kpi} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SectionCard
              title="Montant des transactions par année"
              subtitle="SUM(montant) · Md FCFA"
              className="lg:col-span-2"
            >
              <MontantBarChart data={data.transactionsByYear} dataKey="montant" xKey="annee" />
            </SectionCard>

            <SectionCard title="Répartition par canal" subtitle="Digital vs physique (part %)">
              <ShareDonut data={data.canalSplit} />
            </SectionCard>
          </div>

          <DataTable rows={data.recentTransactions} />
        </>
      )}
    </div>
  )
}
