"use client"

import { FormEvent, useMemo, useState } from "react"
import { Bot, DatabaseZap, Loader2, Send, Sparkles } from "lucide-react"
import { askFinanceQuestion, type AskResponse } from "@/lib/finance-api"

const examples = [
  "Quelles sont les zones avec un flux d'activite assez consequent ?",
  "Classe les agences par montant de transactions.",
  "Quels canaux generent le plus de transactions ?",
]

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "-"
  if (typeof value === "number") return new Intl.NumberFormat("fr-FR").format(value)
  return String(value)
}

export function AiQueryPanel() {
  const [question, setQuestion] = useState(examples[0])
  const [result, setResult] = useState<AskResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const columns = useMemo(() => {
    if (!result?.data.length) return []
    return Object.keys(result.data[0])
  }, [result])

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()

    if (!question.trim() || loading) return

    setLoading(true)
    setError(null)

    try {
      const response = await askFinanceQuestion(question.trim())
      setResult(response)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <section className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Assistant BI</h2>
            <p className="text-sm text-muted-foreground">Mistral traduit la question en requete Cube.</p>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={3}
            className="min-h-24 resize-y rounded-lg border border-input bg-background p-3 text-sm outline-none transition-shadow focus:ring-3 focus:ring-ring/20"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setQuestion(example)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Sparkles className="size-3" aria-hidden="true" />
                  {example}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
              Interroger
            </button>
          </div>
        </form>
      </section>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      {result && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <DatabaseZap className="size-4 text-primary" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-foreground">Resultats</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-muted text-xs uppercase text-muted-foreground">
                  <tr>
                    {columns.map((column) => (
                      <th key={column} className="px-4 py-3 font-semibold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((row, index) => (
                    <tr key={index} className="border-t border-border">
                      {columns.map((column) => (
                        <td key={column} className="px-4 py-3 text-foreground">
                          {formatCell(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {!result.data.length && (
                    <tr>
                      <td className="px-4 py-8 text-center text-muted-foreground">Aucun resultat.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Requete Cube</h3>
            <pre className="max-h-[520px] overflow-auto rounded-lg bg-muted p-3 text-xs leading-relaxed text-foreground">
              {JSON.stringify(result.cubeQuery, null, 2)}
            </pre>
          </aside>
        </section>
      )}
    </div>
  )
}
