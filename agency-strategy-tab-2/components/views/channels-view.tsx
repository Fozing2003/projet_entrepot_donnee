import { useEffect, useState } from "react"
import { SectionCard, RankingBarList, ShareDonut } from "@/components/widgets"
import { getChannelsData } from "@/lib/dashboard-api"
import type { ChannelsData } from "@/lib/dashboard-types"

export function ChannelsView() {
  const [data, setData] = useState<ChannelsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const channelsData = await getChannelsData()
        if (!cancelled) setData(channelsData)
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
              title="Transactions par canal"
              subtitle="vue_transactions_par_canal · dim_canal"
              className="lg:col-span-2"
            >
              <RankingBarList rows={data.transactionsByCanal} />
            </SectionCard>

            <SectionCard title="Digital vs physique" subtitle="Part en %">
              <ShareDonut data={data.canalSplit} />
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SectionCard title="Types d'opération" subtitle="dim_type_operation (8 opérations)">
              <RankingBarList rows={data.transactionsByOperation} />
            </SectionCard>

            <SectionCard title="Comptes & produits bancaires" subtitle="dim_compte">
              <RankingBarList rows={data.transactionsByCompte} />
            </SectionCard>
          </div>

          <SectionCard title="Institutions concurrentes" subtitle="dim_institution_concurrente">
            <RankingBarList rows={data.institutionsConcurrentes} />
          </SectionCard>
        </>
      )}
    </div>
  )
}
