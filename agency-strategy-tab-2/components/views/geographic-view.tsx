import { useEffect, useState } from "react"
import { SectionCard, RankingBarList } from "@/components/widgets"
import { getGeographicData } from "@/lib/dashboard-api"
import type { GeographicData } from "@/lib/dashboard-types"

export function GeographicView() {
  const [data, setData] = useState<GeographicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const geographic = await getGeographicData()
        if (!cancelled) setData(geographic)
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
          <SectionCard
            title="Montant des transactions par région"
            subtitle="vue_analyse_geographique · dim_zone_geographique"
          >
            <RankingBarList rows={data.transactionsByRegion} />
          </SectionCard>

          <SectionCard
            title="Top quartiers par volume"
            subtitle="Ville · arrondissement (Md FCFA et nombre de transactions)"
          >
            <RankingBarList rows={data.transactionsByQuartier} />
          </SectionCard>
        </>
      )}
    </div>
  )
}
