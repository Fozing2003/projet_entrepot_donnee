// ---------------------------------------------------------------------------
// Données simulées de l'entrepôt bancaire (schéma en étoile)
// Table de faits : Fact_Transactions (mesures : montant, frais_operation)
// Dimensions : dim_temps, dim_zone_geographique, dim_agence, dim_client,
//              dim_compte, dim_type_operation, dim_canal, dim_institution_concurrente
// Période : 2018 → 2026. Montants exprimés en FCFA.
// Remplacer ces constantes par des appels aux vues SQL (vue_transactions_annuelles, etc.).
// ---------------------------------------------------------------------------

export const YEARS = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"] as const

// --- Indicateurs globaux (synthèse) -----------------------------------------
export type Kpi = {
  label: string
  value: string
  sublabel: string
  delta: number
  positiveIsGood: boolean
}

export const globalKpis: Kpi[] = [
  {
    label: "Montant total des transactions",
    value: "1 978 Md FCFA",
    sublabel: "Mesure : SUM(montant)",
    delta: 13.6,
    positiveIsGood: true,
  },
  {
    label: "Total des frais d'opération",
    value: "16,7 Md FCFA",
    sublabel: "Mesure : SUM(frais_operation)",
    delta: 9.2,
    positiveIsGood: true,
  },
  {
    label: "Nombre de transactions",
    value: "120 000",
    sublabel: "COUNT(Fact_Transactions)",
    delta: 8.4,
    positiveIsGood: true,
  },
  {
    label: "Clients actifs",
    value: "6 000",
    sublabel: "dim_client",
    delta: 4.1,
    positiveIsGood: true,
  },
]

// --- dim_temps : agrégats annuels (vue_transactions_annuelles) ---------------
export type YearRow = {
  annee: string
  montant: number // milliards FCFA
  frais: number // milliards FCFA
  transactions: number
}

export const transactionsByYear: YearRow[] = [
  { annee: "2018", montant: 142, frais: 1.2, transactions: 9800 },
  { annee: "2019", montant: 168, frais: 1.4, transactions: 11200 },
  { annee: "2020", montant: 151, frais: 1.3, transactions: 10500 },
  { annee: "2021", montant: 189, frais: 1.6, transactions: 12800 },
  { annee: "2022", montant: 224, frais: 1.9, transactions: 14600 },
  { annee: "2023", montant: 263, frais: 2.2, transactions: 16400 },
  { annee: "2024", montant: 301, frais: 2.5, transactions: 18100 },
  { annee: "2025", montant: 342, frais: 2.9, transactions: 19900 },
  { annee: "2026", montant: 198, frais: 1.7, transactions: 11700 },
]

// Évolution mensuelle de l'activité (montant en milliards FCFA)
export const monthlyEvolution = [
  { mois: "Janv.", montant: 19.4 },
  { mois: "Févr.", montant: 18.1 },
  { mois: "Mars", montant: 21.6 },
  { mois: "Avr.", montant: 20.2 },
  { mois: "Mai", montant: 23.0 },
  { mois: "Juin", montant: 22.4 },
  { mois: "Juil.", montant: 24.8 },
  { mois: "Août", montant: 23.9 },
  { mois: "Sept.", montant: 22.1 },
  { mois: "Oct.", montant: 25.3 },
  { mois: "Nov.", montant: 24.0 },
  { mois: "Déc.", montant: 26.7 },
]

// --- dim_zone_geographique (vue_analyse_geographique) ------------------------
export type ZoneRow = {
  libelle: string
  detail: string
  montant: number // milliards FCFA
  transactions: number
}

export const transactionsByRegion: ZoneRow[] = [
  { libelle: "Dakar", detail: "Région", montant: 812, transactions: 49200 },
  { libelle: "Thiès", detail: "Région", montant: 264, transactions: 16800 },
  { libelle: "Diourbel", detail: "Région", montant: 198, transactions: 12100 },
  { libelle: "Saint-Louis", detail: "Région", montant: 156, transactions: 9400 },
  { libelle: "Kaolack", detail: "Région", montant: 132, transactions: 8200 },
  { libelle: "Ziguinchor", detail: "Région", montant: 98, transactions: 6100 },
  { libelle: "Louga", detail: "Région", montant: 76, transactions: 4900 },
  { libelle: "Autres régions", detail: "Fatick, Kolda, Matam…", montant: 242, transactions: 13300 },
]

export const transactionsByQuartier: ZoneRow[] = [
  { libelle: "Plateau", detail: "Dakar · Dakar", montant: 184, transactions: 11200 },
  { libelle: "Médina", detail: "Dakar · Dakar", montant: 142, transactions: 9100 },
  { libelle: "Parcelles Assainies", detail: "Dakar · Pikine", montant: 128, transactions: 8600 },
  { libelle: "Grand Yoff", detail: "Dakar · Dakar", montant: 96, transactions: 6400 },
  { libelle: "Touba Mosquée", detail: "Diourbel · Mbacké", montant: 88, transactions: 5300 },
  { libelle: "Guédiawaye Centre", detail: "Dakar · Guédiawaye", montant: 74, transactions: 5000 },
]

// --- dim_agence (vue_performance_agence) -------------------------------------
export type AgenceRow = {
  nom: string
  type: string
  statut: string
  montant: number // milliards FCFA
  frais: number // milliards FCFA
  transactions: number
}

export const performanceAgences: AgenceRow[] = [
  { nom: "Agence Plateau", type: "Principale", statut: "Active", montant: 168, frais: 1.42, transactions: 10200 },
  { nom: "Agence Médina", type: "Secondaire", statut: "Active", montant: 124, frais: 1.05, transactions: 8400 },
  { nom: "Agence Thiès Centre", type: "Secondaire", statut: "Active", montant: 98, frais: 0.86, transactions: 6900 },
  { nom: "Point Service Touba", type: "Point service", statut: "Active", montant: 82, frais: 0.71, transactions: 5600 },
  { nom: "Agence Saint-Louis", type: "Secondaire", statut: "Active", montant: 64, frais: 0.58, transactions: 4300 },
  { nom: "Agence Ziguinchor", type: "Secondaire", statut: "En développement", montant: 41, frais: 0.39, transactions: 2800 },
]

// Répartition par type d'agence (part en %)
export const agenceByType = [
  { name: "Principale", value: 14 },
  { name: "Secondaire", value: 38 },
  { name: "Point service", value: 31 },
  { name: "Agent de terrain", value: 17 },
]

// --- dim_canal (vue_transactions_par_canal) ----------------------------------
export type CategoryRow = {
  libelle: string
  detail: string
  montant: number // milliards FCFA
  transactions: number
}

export const transactionsByCanal: CategoryRow[] = [
  { libelle: "Mobile Money", detail: "Digital", montant: 612, transactions: 42600 },
  { libelle: "Application mobile", detail: "Digital", montant: 408, transactions: 26800 },
  { libelle: "Guichet", detail: "Physique", montant: 372, transactions: 21400 },
  { libelle: "Agent de terrain", detail: "Physique", montant: 214, transactions: 14900 },
  { libelle: "USSD", detail: "Digital", montant: 132, transactions: 10600 },
  { libelle: "Virement", detail: "Digital", montant: 86, transactions: 3700 },
]

// Répartition canaux digitaux vs physiques (part en %)
export const canalSplit = [
  { name: "Digital", value: 64 },
  { name: "Physique", value: 36 },
]

// --- dim_type_operation ------------------------------------------------------
export const transactionsByOperation: CategoryRow[] = [
  { libelle: "Dépôt", detail: "Crédit · DEP", montant: 486, transactions: 28400 },
  { libelle: "Retrait", detail: "Débit · RET", montant: 398, transactions: 31200 },
  { libelle: "Transfert", detail: "Débit · TRF", montant: 342, transactions: 22600 },
  { libelle: "Paiement facture", detail: "Débit · PAY", montant: 198, transactions: 18900 },
  { libelle: "Virement", detail: "Débit · VIR", montant: 156, transactions: 9700 },
  { libelle: "Change", detail: "Crédit · CHG", montant: 88, transactions: 4100 },
  { libelle: "Prélèvement", detail: "Débit · PRL", montant: 62, transactions: 3600 },
  { libelle: "Frais de service", detail: "Crédit · FRS", montant: 24, transactions: 1500 },
]

// --- dim_compte --------------------------------------------------------------
export const transactionsByCompte: CategoryRow[] = [
  { libelle: "Compte courant", detail: "Compte chèque standard", montant: 624, transactions: 38200 },
  { libelle: "Compte épargne", detail: "Livret épargne", montant: 412, transactions: 27600 },
  { libelle: "Compte commerçant", detail: "Encaissement commerce", montant: 386, transactions: 24800 },
  { libelle: "Compte professionnel", detail: "Entreprises & PME", montant: 298, transactions: 16400 },
  { libelle: "Tontine", detail: "Épargne collective", montant: 154, transactions: 13000 },
]

// --- dim_institution_concurrente ---------------------------------------------
export const institutionsConcurrentes: CategoryRow[] = [
  { libelle: "Wave", detail: "Mobile Money", montant: 268, transactions: 19800 },
  { libelle: "Orange Money", detail: "Mobile Money", montant: 224, transactions: 16400 },
  { libelle: "CBAO", detail: "Banque", montant: 142, transactions: 7200 },
  { libelle: "Free Money", detail: "Mobile Money", montant: 96, transactions: 8100 },
  { libelle: "Ecobank", detail: "Banque", montant: 84, transactions: 4600 },
  { libelle: "BICIS", detail: "Banque", montant: 61, transactions: 3300 },
]

// --- Échantillon de transactions (Fact_Transactions) -------------------------
export type TransactionRow = {
  date: string
  agence: string
  operation: string
  canal: string
  montant: number // FCFA — positif = crédit, négatif = débit
}

export const recentTransactions: TransactionRow[] = [
  { date: "12/06/2026", agence: "Agence Plateau", operation: "Dépôt", canal: "Guichet", montant: 4825000 },
  { date: "12/06/2026", agence: "Point Service Touba", operation: "Retrait", canal: "Mobile Money", montant: -1284000 },
  { date: "11/06/2026", agence: "Agence Médina", operation: "Transfert", canal: "Application mobile", montant: -962500 },
  { date: "11/06/2026", agence: "Agence Thiès Centre", operation: "Dépôt", canal: "Agent de terrain", montant: 2139000 },
  { date: "10/06/2026", agence: "Agence Plateau", operation: "Paiement facture", canal: "USSD", montant: -512300 },
  { date: "10/06/2026", agence: "Agence Saint-Louis", operation: "Change", canal: "Guichet", montant: 1746000 },
  { date: "09/06/2026", agence: "Agence Médina", operation: "Prélèvement", canal: "Virement", montant: -897500 },
  { date: "09/06/2026", agence: "Agence Ziguinchor", operation: "Dépôt", canal: "Mobile Money", montant: 583000 },
  { date: "08/06/2026", agence: "Agence Plateau", operation: "Retrait", canal: "Guichet", montant: -2472000 },
  { date: "08/06/2026", agence: "Point Service Touba", operation: "Virement", canal: "Application mobile", montant: -1340000 },
]

// --- Analyse décisionnelle : ouverture d'une nouvelle agence (section 19) -----
export type DecisionCriterion = {
  label: string
  status: "favorable" | "neutre" | "defavorable"
  detail: string
}

export type AgencyAnalysis = {
  areaName: string
  potentialScore: number
  totalTransactionAmount: number // FCFA
  transactionCount: number
  uniqueCustomers: number
  digitalAdoptionRate: number
  existingBranches: number
  competitorCount: number
  criteria: DecisionCriterion[]
}

export const mockAgencyAnalysis: AgencyAnalysis = {
  areaName: "Parcelles Assainies, Dakar (Pikine)",
  potentialScore: 82,
  totalTransactionAmount: 128_000_000_000,
  transactionCount: 8600,
  uniqueCustomers: 4120,
  digitalAdoptionRate: 73.5,
  existingBranches: 1,
  competitorCount: 2,
  criteria: [
    { label: "Volume de transactions élevé", status: "favorable", detail: "128 Md FCFA sur la zone" },
    { label: "Forte adoption des canaux digitaux", status: "favorable", detail: "73,5 % Mobile Money / app" },
    { label: "Faible couverture physique", status: "favorable", detail: "1 agence pour la zone" },
    { label: "Concurrence modérée", status: "neutre", detail: "Wave et Orange Money présents" },
  ],
}
