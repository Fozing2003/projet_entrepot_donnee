export type CubeRow = Record<string, string | number | boolean | null>

export type AskResponse = {
  question: string
  cubeQuery: Record<string, unknown>
  data: CubeRow[]
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_FINANCE_API_URL || "http://localhost:5000"

export async function askFinanceQuestion(question: string): Promise<AskResponse> {
  const response = await fetch(`${API_BASE_URL}/api/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.error || "Impossible d'interroger le backend analytique")
  }

  return payload
}
