import { CubeService } from "./cube.service";

type RawRow = Record<string, unknown>;

type RevenueRow = {
  montant: number
  transactions: number
  [key: string]: unknown
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value
  if (typeof value === "string") return Number(value)
  return 0
}

function toBillions(value: unknown): number {
  return Number((toNumber(value) / 1_000_000_000).toFixed(3))
}

function makePercentSlice(rows: RawRow[], dimensionKey: string) {
  const total = rows.reduce((sum, row) => sum + toNumber(row["Transactions.totalRevenue"]), 0)
  return rows.map((row) => ({
    name: String(row[dimensionKey] ?? "Autre"),
    value: total > 0 ? Number(((toNumber(row["Transactions.totalRevenue"]) / total) * 100).toFixed(1)) : 0,
  }))
}

function mapRevenueRows(rows: RawRow[], dimensionKeys: string[]) {
  return rows.map((row) => {
    const result: Record<string, unknown> = {}
    for (const key of dimensionKeys) {
      result[key.replace(/\./g, "_")] = row[key]
    }
    result.montant = toBillions(row["Transactions.totalRevenue"])
    result.transactions = toNumber(row["Transactions.transactionCount"])
    if (row["Transactions.totalFees"] !== undefined) {
      result.frais = toBillions(row["Transactions.totalFees"])
    }
    return result
  })
}

export class DashboardService {
  private cube = new CubeService();

  private async execute(query: unknown) {
    return this.cube.execute(query as any) as Promise<RawRow[]>
  }

  async getOverviewData() {
    const totals = await this.execute({
      measures: [
        "Transactions.totalRevenue",
        "Transactions.totalFees",
        "Transactions.transactionCount",
        "Transactions.uniqueCustomers",
      ],
    })

    const yearRows = await this.execute({
      measures: ["Transactions.totalRevenue", "Transactions.totalFees", "Transactions.transactionCount"],
      dimensions: ["Temps.annee"],
      order: { "Temps.annee": "asc" },
      limit: 100,
    })

    const canalRows = await this.execute({
      measures: ["Transactions.totalRevenue"],
      dimensions: ["Canaux.type_canal"],
      order: { "Transactions.totalRevenue": "desc" },
      limit: 100,
    })

    const recentRows = await this.execute({
      measures: ["Transactions.totalRevenue"],
      dimensions: [
        "Transactions.transactionId",
        "Temps.date",
        "Agences.nom",
        "Operations.libelle_operation",
        "Canaux.nom_canal",
      ],
      order: { "Temps.date": "desc" },
      limit: 10,
    })

    const totalsRow = totals[0] ?? {}

    return {
      totals: {
        totalRevenue: toNumber(totalsRow["Transactions.totalRevenue"]),
        totalFees: toNumber(totalsRow["Transactions.totalFees"]),
        transactionCount: toNumber(totalsRow["Transactions.transactionCount"]),
        uniqueCustomers: toNumber(totalsRow["Transactions.uniqueCustomers"]),
      },
      transactionsByYear: yearRows.map((row) => ({
        annee: String(row["Temps.annee"] ?? ""),
        montant: toBillions(row["Transactions.totalRevenue"]),
        frais: toBillions(row["Transactions.totalFees"]),
        transactions: toNumber(row["Transactions.transactionCount"]),
      })),
      canalSplit: makePercentSlice(canalRows, "Canaux.type_canal"),
      recentTransactions: recentRows.map((row) => ({
        date: String(row["Temps.date"] ?? ""),
        agence: String(row["Agences.nom"] ?? ""),
        operation: String(row["Operations.libelle_operation"] ?? ""),
        canal: String(row["Canaux.nom_canal"] ?? ""),
        montant: toNumber(row["Transactions.totalRevenue"]),
      })),
    }
  }

  async getTemporalData() {
    const yearRows = await this.execute({
      measures: ["Transactions.totalRevenue", "Transactions.totalFees", "Transactions.transactionCount"],
      dimensions: ["Temps.annee"],
      order: { "Temps.annee": "asc" },
      limit: 100,
    })

    const monthRows = await this.execute({
      measures: ["Transactions.totalRevenue"],
      dimensions: ["Temps.mois"],
      order: { "Temps.mois": "asc" },
      limit: 12,
    })

    const monthNames = [
      "Janv.",
      "Févr.",
      "Mars",
      "Avr.",
      "Mai",
      "Juin",
      "Juil.",
      "Août",
      "Sept.",
      "Oct.",
      "Nov.",
      "Déc.",
    ]

    return {
      transactionsByYear: yearRows.map((row) => ({
        annee: String(row["Temps.annee"] ?? ""),
        montant: toBillions(row["Transactions.totalRevenue"]),
        frais: toBillions(row["Transactions.totalFees"]),
        transactions: toNumber(row["Transactions.transactionCount"]),
      })),
      monthlyEvolution: monthRows.map((row) => {
        const month = Number(row["Temps.mois"])
        return {
          mois: monthNames[month - 1] ?? String(month),
          montant: toBillions(row["Transactions.totalRevenue"]),
        }
      }),
    }
  }

  async getGeographicData() {
    const regionRows = await this.execute({
      measures: ["Transactions.totalRevenue", "Transactions.transactionCount"],
      dimensions: ["Zones.region"],
      order: { "Transactions.totalRevenue": "desc" },
      limit: 20,
    })

    const quartierRows = await this.execute({
      measures: ["Transactions.totalRevenue", "Transactions.transactionCount"],
      dimensions: ["Zones.quartier", "Zones.ville"],
      order: { "Transactions.totalRevenue": "desc" },
      limit: 20,
    })

    return {
      transactionsByRegion: regionRows.map((row) => ({
        libelle: String(row["Zones.region"] ?? ""),
        detail: "Région",
        montant: toBillions(row["Transactions.totalRevenue"]),
        transactions: toNumber(row["Transactions.transactionCount"]),
      })),
      transactionsByQuartier: quartierRows.map((row) => ({
        libelle: String(row["Zones.quartier"] ?? ""),
        detail: String(row["Zones.ville"] ?? ""),
        montant: toBillions(row["Transactions.totalRevenue"]),
        transactions: toNumber(row["Transactions.transactionCount"]),
      })),
    }
  }

  async getAgencyData() {
    const agenceRows = await this.execute({
      measures: ["Transactions.totalRevenue", "Transactions.totalFees", "Transactions.transactionCount"],
      dimensions: ["Agences.nom", "Agences.type", "Agences.statut"],
      order: { "Transactions.totalRevenue": "desc" },
      limit: 20,
    })

    const typeRows = await this.execute({
      measures: ["Transactions.totalRevenue"],
      dimensions: ["Agences.type"],
      order: { "Transactions.totalRevenue": "desc" },
      limit: 20,
    })

    const totalRevenue = typeRows.reduce((sum, row) => sum + toNumber(row["Transactions.totalRevenue"]), 0)

    return {
      performanceAgences: agenceRows.map((row) => ({
        nom: String(row["Agences.nom"] ?? ""),
        type: String(row["Agences.type"] ?? ""),
        statut: String(row["Agences.statut"] ?? ""),
        montant: toBillions(row["Transactions.totalRevenue"]),
        frais: toBillions(row["Transactions.totalFees"]),
        transactions: toNumber(row["Transactions.transactionCount"]),
      })),
      agenceByType: typeRows.map((row) => ({
        name: String(row["Agences.type"] ?? ""),
        value: totalRevenue > 0 ? Number(((toNumber(row["Transactions.totalRevenue"]) / totalRevenue) * 100).toFixed(1)) : 0,
      })),
    }
  }

  async getChannelsData() {
    const canalRows = await this.execute({
      measures: ["Transactions.totalRevenue", "Transactions.transactionCount"],
      dimensions: ["Canaux.nom_canal", "Canaux.type_canal"],
      order: { "Transactions.totalRevenue": "desc" },
      limit: 20,
    })

    const canalSplitRows = await this.execute({
      measures: ["Transactions.totalRevenue"],
      dimensions: ["Canaux.type_canal"],
      order: { "Transactions.totalRevenue": "desc" },
      limit: 20,
    })

    const operationRows = await this.execute({
      measures: ["Transactions.totalRevenue", "Transactions.transactionCount"],
      dimensions: ["Operations.libelle_operation", "Operations.categorie_operation"],
      order: { "Transactions.totalRevenue": "desc" },
      limit: 20,
    })

    const compteRows = await this.execute({
      measures: ["Transactions.totalRevenue", "Transactions.transactionCount"],
      dimensions: ["Comptes.type_compte", "Comptes.produit_bancaire"],
      order: { "Transactions.totalRevenue": "desc" },
      limit: 20,
    })

    const concurrentRows = await this.execute({
      measures: ["Transactions.totalRevenue", "Transactions.transactionCount"],
      dimensions: ["Concurrents.nom_institution", "Concurrents.type_institution"],
      order: { "Transactions.totalRevenue": "desc" },
      limit: 20,
    })

    return {
      transactionsByCanal: canalRows.map((row) => ({
        libelle: String(row["Canaux.nom_canal"] ?? ""),
        detail: String(row["Canaux.type_canal"] ?? ""),
        montant: toBillions(row["Transactions.totalRevenue"]),
        transactions: toNumber(row["Transactions.transactionCount"]),
      })),
      canalSplit: makePercentSlice(canalSplitRows, "Canaux.type_canal"),
      transactionsByOperation: operationRows.map((row) => ({
        libelle: String(row["Operations.libelle_operation"] ?? ""),
        detail: String(row["Operations.categorie_operation"] ?? ""),
        montant: toBillions(row["Transactions.totalRevenue"]),
        transactions: toNumber(row["Transactions.transactionCount"]),
      })),
      transactionsByCompte: compteRows.map((row) => ({
        libelle: String(row["Comptes.type_compte"] ?? ""),
        detail: String(row["Comptes.produit_bancaire"] ?? ""),
        montant: toBillions(row["Transactions.totalRevenue"]),
        transactions: toNumber(row["Transactions.transactionCount"]),
      })),
      institutionsConcurrentes: concurrentRows.map((row) => ({
        libelle: String(row["Concurrents.nom_institution"] ?? ""),
        detail: String(row["Concurrents.type_institution"] ?? ""),
        montant: toBillions(row["Transactions.totalRevenue"]),
        transactions: toNumber(row["Transactions.transactionCount"]),
      })),
    }
  }

  async getStrategyData() {
    const zoneRows = await this.execute({
      measures: [
        "Transactions.totalRevenue",
        "Transactions.transactionCount",
        "Transactions.uniqueCustomers",
        "Transactions.branchCount",
        "Transactions.competitorCount",
      ],
      dimensions: ["Zones.quartier", "Zones.ville"],
      order: { "Transactions.totalRevenue": "desc" },
      limit: 1,
    })

    const topZone = zoneRows[0]
    if (!topZone) {
      return {
        areaName: "Aucune zone disponible",
        potentialScore: 0,
        totalTransactionAmount: 0,
        transactionCount: 0,
        uniqueCustomers: 0,
        digitalAdoptionRate: 0,
        existingBranches: 0,
        competitorCount: 0,
        criteria: [],
      }
    }

    const areaName = `${String(topZone["Zones.quartier"] ?? "")}, ${String(topZone["Zones.ville"] ?? "")}`
    const totalRevenueMd = toBillions(topZone["Transactions.totalRevenue"])
    const transactionCount = toNumber(topZone["Transactions.transactionCount"])
    const uniqueCustomers = toNumber(topZone["Transactions.uniqueCustomers"])
    const existingBranches = toNumber(topZone["Transactions.branchCount"])
    const competitorCount = toNumber(topZone["Transactions.competitorCount"])

    const channelRows = await this.execute({
      measures: ["Transactions.totalRevenue"],
      dimensions: ["Canaux.type_canal"],
      filters: [
        {
          member: "Zones.quartier",
          operator: "equals",
          values: [String(topZone["Zones.quartier"] ?? "")],
        },
        {
          member: "Zones.ville",
          operator: "equals",
          values: [String(topZone["Zones.ville"] ?? "")],
        },
      ],
      limit: 10,
    })

    const totalZoneRevenue = channelRows.reduce((sum, row) => sum + toNumber(row["Transactions.totalRevenue"]), 0)
    const digitalRevenue = channelRows
      .filter((row) => String(row["Canaux.type_canal"] ?? "").toLowerCase().includes("digital"))
      .reduce((sum, row) => sum + toNumber(row["Transactions.totalRevenue"]), 0)

    const digitalAdoptionRate = totalZoneRevenue > 0 ? Number(((digitalRevenue / totalZoneRevenue) * 100).toFixed(1)) : 0
    const potentialScore = Math.min(100, Math.max(45, Math.round(55 + totalRevenueMd / 10)))

    return {
      areaName,
      potentialScore,
      totalTransactionAmount: Number(topZone["Transactions.totalRevenue"] ?? 0),
      transactionCount,
      uniqueCustomers,
      digitalAdoptionRate,
      existingBranches,
      competitorCount,
      criteria: [
        {
          label: "Volume de transactions élevé",
          status: "favorable",
          detail: `${formatNumber(transactionCount)} transactions enregistrées`,
        },
        {
          label: "Adoption des canaux digitaux",
          status: digitalAdoptionRate >= 60 ? "favorable" : "neutre",
          detail: `${digitalAdoptionRate}% du volume sur digital`,
        },
        {
          label: "Couverture physique",
          status: existingBranches > 1 ? "neutre" : "favorable",
          detail: `${existingBranches} agence(s) dans la zone`,
        },
        {
          label: "Concurrence locale",
          status: competitorCount <= 2 ? "neutre" : "defavorable",
          detail: `${competitorCount} concurrent(s) actifs`,
        },
      ],
    }
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value)
}
