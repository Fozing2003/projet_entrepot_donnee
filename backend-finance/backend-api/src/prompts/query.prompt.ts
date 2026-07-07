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

Les membres doivent provenir EXCLUSIVEMENT du catalogue.

Catalogue :

${JSON.stringify(catalog)}

Format attendu :

{
  "measures": [],
  "dimensions": [],
  "filters": [],
  "order": {},
  "limit": 10
}

Question :

${question}

JSON :
`;

}