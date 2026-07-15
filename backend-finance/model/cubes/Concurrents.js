cube(`Concurrents`, {
  sql: `SELECT * FROM warehouse.dim_institution_concurrente`,

  title: `Concurrents`,

  dimensions: {
    id: {
      sql: `id_concurrent`,
      type: `number`,
      primaryKey: true
    },

    nom: {
      sql: `nom_institution`,
      type: `string`
    },

    type: {
      sql: `type_institution`,
      type: `string`
    },

    categorie: {
      sql: `categorie_institution`,
      type: `string`
    }
  }
});
