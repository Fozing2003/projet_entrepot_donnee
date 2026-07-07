cube(`Agences`, {
  sql: `
    SELECT *
    FROM public.dim_agence
  `,

  title: `Agences`,

  dimensions: {
    id: {
      sql: `id_agence`,
      type: `number`,
      primaryKey: true
    },

    code: {
      sql: `code_agence`,
      type: `string`
    },

    nom: {
      sql: `nom_agence`,
      type: `string`
    },

    type: {
      sql: `type_agence`,
      type: `string`
    },

    statut: {
      sql: `statut_agence`,
      type: `string`
    },

    dateOuverture: {
      sql: `date_ouverture`,
      type: `time`
    }
  }
});