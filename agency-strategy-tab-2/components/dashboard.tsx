"use client"

import { useState } from "react"
import { Sidebar, type TabId } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { OverviewView } from "@/components/views/overview-view"
import { TemporalView } from "@/components/views/temporal-view"
import { GeographicView } from "@/components/views/geographic-view"
import { AgencyView } from "@/components/views/agency-view"
import { ChannelsView } from "@/components/views/channels-view"
import { AgencyStrategy } from "@/components/agency-strategy"
import { AiQueryPanel } from "@/components/ai-query-panel"

const titles: Record<TabId, string> = {
  overview: "Synthèse de l'entrepôt",
  temporal: "Analyse temporelle",
  geographic: "Analyse géographique",
  agency: "Analyse des agences",
  channels: "Canaux, comptes & concurrence",
  strategy: "Stratégie d'implantation",
  assistant: "Assistant analytique",
}

export function Dashboard() {
  const [tab, setTab] = useState<TabId>("overview")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar active={tab} onSelect={setTab} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={titles[tab]} />
        <main className="flex-1 overflow-y-auto p-6">
          {tab === "overview" && <OverviewView />}
          {tab === "temporal" && <TemporalView />}
          {tab === "geographic" && <GeographicView />}
          {tab === "agency" && <AgencyView />}
          {tab === "channels" && <ChannelsView />}
          {tab === "strategy" && <AgencyStrategy />}
          {tab === "assistant" && <AiQueryPanel />}
        </main>
      </div>
    </div>
  )
}
