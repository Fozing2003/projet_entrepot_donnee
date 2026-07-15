export function buildPrompt(question: string, catalog: any) {

return `
Tu es un moteur BI.

Tu dois convertir une question utilisateur
en requête Cube.

Règles :

- Tu réponds UNIQUEMENT en JSON.
- Aucun texte.
- Aucun markdown.
- Aucun commentaire.
- Les propriétés vides doivent être omises sauf "limit".
- Pour "flux", "activité" ou "volume d'activité", utilise Transactions.transactionCount et Transactions.totalRevenue.
- Pour les zones, utilise Zones.region, Zones.ville et Zones.quartier.
- Si l'utilisateur demande les plus importants, trie en ordre descendant.

Les membres doivent provenir EXCLUSIVEMENT du catalogue.

Catalogue :

${JSON.stringify(catalog)}

Format attendu :

{
  "measures": ["Transactions.transactionCount"],
  "dimensions": ["Zones.ville"],
  "order": {
    "Transactions.transactionCount": "desc"
  },
  "limit": 10
}

Question :

${question}

JSON :
`;

}
