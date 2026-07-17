import { API_BASE_URL } from "./finance-api"
import type {
  OverviewData,
  TemporalData,
  GeographicData,
  AgencyData,
  ChannelsData,
  AgencyAnalysis,
} from "./dashboard-types"

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`)
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(payload?.error || `Erreur API ${response.status}`)
  }
  return payload as T
}

export async function getOverviewData(): Promise<OverviewData> {
  return fetchJson<OverviewData>("/api/dashboard/overview")
}

export async function getTemporalData(): Promise<TemporalData> {
  return fetchJson<TemporalData>("/api/dashboard/temporal")
}

export async function getGeographicData(): Promise<GeographicData> {
  return fetchJson<GeographicData>("/api/dashboard/geographic")
}

export async function getAgencyData(): Promise<AgencyData> {
  return fetchJson<AgencyData>("/api/dashboard/agency")
}

export async function getChannelsData(): Promise<ChannelsData> {
  return fetchJson<ChannelsData>("/api/dashboard/channels")
}

export async function getStrategyData(): Promise<AgencyAnalysis> {
  return fetchJson<AgencyAnalysis>("/api/dashboard/strategy")
}
