import { recentTransactions } from "@/lib/mock-data"
import { formatAmount } from "@/lib/format"
import { cn } from "@/lib/utils"

export function DataTable() {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Transactions récentes</h2>
          <p className="text-xs text-muted-foreground">Extrait de Fact_Transactions</p>
        </div>
        <span className="text-xs text-muted-foreground">{recentTransactions.length} écritures</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Agence</th>
              <th className="px-5 py-3 font-medium">Type d'opération</th>
              <th className="px-5 py-3 font-medium">Canal</th>
              <th className="px-5 py-3 text-right font-medium">Montant</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((row, i) => {
              const isNegative = row.montant < 0
              return (
                <tr
                  key={`${row.date}-${row.agence}-${i}`}
                  className={cn(
                    "border-b border-border/60 last:border-0",
                    i % 2 === 1 && "bg-muted/40",
                  )}
                >
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-muted-foreground">{row.date}</td>
                  <td className="px-5 py-3 text-foreground">{row.agence}</td>
                  <td className="px-5 py-3 text-foreground">{row.operation}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.canal}</td>
                  <td
                    className={cn(
                      "whitespace-nowrap px-5 py-3 text-right font-mono font-medium tabular-nums",
                      isNegative ? "text-destructive" : "text-success",
                    )}
                  >
                    {isNegative ? "-" : "+"}
                    {formatAmount(Math.abs(row.montant))} FCFA
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
