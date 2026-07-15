cube(`Comptes`, {
  sql: `SELECT * FROM warehouse.dim_compte`,

  title: `Comptes`,

  dimensions: {
    id: {
      sql: `id_compte`,
      type: `number`,
      primaryKey: true
    },

    numero: {
      sql: `numero_compte`,
      type: `string`
    },

    type: {
      sql: `type_compte`,
      type: `string`
    },

    produit: {
      sql: `produit_bancaire`,
      type: `string`
    },

    statut: {
      sql: `statut_compte`,
      type: `string`
    },

    dateOuverture: {
      sql: `date_ouverture`,
      type: `time`
    }
  }
});
