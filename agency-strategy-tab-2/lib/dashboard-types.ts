export type Kpi = {
  label: string
  value: string
  sublabel: string
  delta: number
  positiveIsGood: boolean
}

export type CategoryRow = {
  libelle: string
  detail: string
  montant: number
  transactions: number
}

export type ZoneRow = {
  libelle: string
  detail: string
  montant: number
  transactions: number
}

export type TransactionRow = {
  date: string
  agence: string
  operation: string
  canal: string
  montant: number
}

export type DecisionCriterion = {
  label: string
  status: "favorable" | "neutre" | "defavorable"
  detail: string
}

export type AgencyAnalysis = {
  areaName: string
  potentialScore: number
  totalTransactionAmount: number
  transactionCount: number
  uniqueCustomers: number
  digitalAdoptionRate: number
  existingBranches: number
  competitorCount: number
  criteria: DecisionCriterion[]
}

export type OverviewData = {
  totals: {
    totalRevenue: number
    totalFees: number
    transactionCount: number
    uniqueCustomers: number
  }
  transactionsByYear: Array<{
    annee: string
    montant: number
    frais: number
    transactions: number
  }>
  canalSplit: Array<{ name: string; value: number }>
  recentTransactions: TransactionRow[]
}

export type TemporalData = {
  transactionsByYear: Array<{
    annee: string
    montant: number
    frais: number
    transactions: number
  }>
  monthlyEvolution: Array<{ mois: string; montant: number }>
}

export type GeographicData = {
  transactionsByRegion: ZoneRow[]
  transactionsByQuartier: ZoneRow[]
}

export type AgencyData = {
  performanceAgences: Array<{
    nom: string
    type: string
    statut: string
    montant: number
    frais: number
    transactions: number
  }>
  agenceByType: Array<{ name: string; value: number }>
}

export type ChannelsData = {
  transactionsByCanal: CategoryRow[]
  canalSplit: Array<{ name: string; value: number }>
  transactionsByOperation: CategoryRow[]
  transactionsByCompte: CategoryRow[]
  institutionsConcurrentes: CategoryRow[]
}
