"use client"

import { ChevronDown, Calendar } from "lucide-react"
import { useState } from "react"

const years = ["Toutes", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"]

export function TopBar({ title }: { title: string }) {
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState("Toutes")

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3.5">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">Entrepôt de données bancaire · Fact_Transactions</p>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
          <span>{year === "Toutes" ? "Période : 2018–2026" : `Année : ${year}`}</span>
          <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
        </button>

        {open && (
          <>
            <button
              type="button"
              aria-label="Fermer le menu"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setOpen(false)}
            />
            <ul className="absolute right-0 z-20 mt-1.5 w-36 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg">
              {years.map((y) => (
                <li key={y}>
                  <button
                    type="button"
                    onClick={() => {
                      setYear(y)
                      setOpen(false)
                    }}
                    className="flex w-full items-center px-3.5 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    {y}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </header>
  )
}
