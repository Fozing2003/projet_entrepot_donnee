import {
  transactionsByCanal,
  canalSplit,
  transactionsByOperation,
  transactionsByCompte,
  institutionsConcurrentes,
} from "@/lib/mock-data"
import { SectionCard, RankingBarList, ShareDonut } from "@/components/widgets"

export function ChannelsView() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          title="Transactions par canal"
          subtitle="vue_transactions_par_canal · dim_canal"
          className="lg:col-span-2"
        >
          <RankingBarList rows={transactionsByCanal} />
        </SectionCard>

        <SectionCard title="Digital vs physique" subtitle="Part en %">
          <ShareDonut data={canalSplit} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Types d'opération" subtitle="dim_type_operation (8 opérations)">
          <RankingBarList rows={transactionsByOperation} />
        </SectionCard>

        <SectionCard title="Comptes & produits bancaires" subtitle="dim_compte">
          <RankingBarList rows={transactionsByCompte} />
        </SectionCard>
      </div>

      <SectionCard title="Institutions concurrentes" subtitle="dim_institution_concurrente">
        <RankingBarList rows={institutionsConcurrentes} />
      </SectionCard>
    </div>
  )
}
