import { transactionsByRegion, transactionsByQuartier } from "@/lib/mock-data"
import { SectionCard, RankingBarList } from "@/components/widgets"

export function GeographicView() {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        title="Montant des transactions par région"
        subtitle="vue_analyse_geographique · dim_zone_geographique"
      >
        <RankingBarList rows={transactionsByRegion} />
      </SectionCard>

      <SectionCard
        title="Top quartiers par volume"
        subtitle="Ville · arrondissement (Md FCFA et nombre de transactions)"
      >
        <RankingBarList rows={transactionsByQuartier} />
      </SectionCard>
    </div>
  )
}
