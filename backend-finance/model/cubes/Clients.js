cube(`Clients`, {
  sql: `SELECT * FROM warehouse.dim_client`,

  title: `Clients`,

  dimensions: {
    id: {
      sql: `id_client`,
      type: `number`,
      primaryKey: true
    },

    code: {
      sql: `code_client`,
      type: `string`
    },

    sexe: {
      sql: `sexe`,
      type: `string`
    },

    trancheAge: {
      sql: `tranche_age`,
      type: `string`
    },

    profession: {
      sql: `profession`,
      type: `string`
    },

    secteur: {
      sql: `secteur_activite`,
      type: `string`
    },

    typeClient: {
      sql: `type_client`,
      type: `string`
    },

    statut: {
      sql: `statut_client`,
      type: `string`
    },

    dateAdhesion: {
      sql: `date_adhesion`,
      type: `time`
    }
  }
});
