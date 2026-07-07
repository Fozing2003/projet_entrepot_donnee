import { globalKpis, transactionsByYear, canalSplit } from "@/lib/mock-data"
import { KpiCard, SectionCard, MontantBarChart, ShareDonut } from "@/components/widgets"
import { DataTable } from "@/components/data-table"

export function OverviewView() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {globalKpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          title="Montant des transactions par année"
          subtitle="SUM(montant) · 2018 → 2026 (Md FCFA)"
          className="lg:col-span-2"
        >
          <MontantBarChart data={transactionsByYear} dataKey="montant" xKey="annee" />
        </SectionCard>

        <SectionCard title="Répartition par canal" subtitle="Digital vs physique (part %)">
          <ShareDonut data={canalSplit} />
        </SectionCard>
      </div>

      <DataTable />
    </div>
  )
}
