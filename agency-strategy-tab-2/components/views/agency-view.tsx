import { performanceAgences, agenceByType } from "@/lib/mock-data"
import { SectionCard, ShareDonut } from "@/components/widgets"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

export function AgencyView() {
  return (
    <div className="flex flex-col gap-4">
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
                {performanceAgences.map((a, i) => (
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
                    <td className="py-2.5 pr-4 text-right font-mono tabular-nums text-foreground">{a.montant} Md</td>
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
          <ShareDonut data={agenceByType} />
        </SectionCard>
      </div>
    </div>
  )
}
