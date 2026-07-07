export function formatAmount(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/** Montant brut en FCFA, ex. "4 825 000 FCFA". */
export function formatCurrency(value: number): string {
  return `${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)} FCFA`
}

/** Montant compact en FCFA, ex. "128 Md FCFA" / "4,8 M FCFA". */
export function formatCompactFCFA(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) {
    return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(value / 1_000_000_000)} Md FCFA`
  }
  if (abs >= 1_000_000) {
    return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(value / 1_000_000)} M FCFA`
  }
  return formatCurrency(value)
}

/** Valeur en milliards FCFA (les données chart sont déjà en Md), ex. "812 Md FCFA". */
export function formatMilliards(value: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(value)} Md FCFA`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value)
}
