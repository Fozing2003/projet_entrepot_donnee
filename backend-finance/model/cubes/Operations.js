cube(`Operations`, {
  sql: `SELECT * FROM warehouse.dim_type_operation`,

  title: `Operations`,

  dimensions: {
    id: {
      sql: `id_type_operation`,
      type: `number`,
      primaryKey: true
    },

    code: {
      sql: `code_operation`,
      type: `string`
    },

    libelle: {
      sql: `libelle_operation`,
      type: `string`
    },

    categorie: {
      sql: `categorie_operation`,
      type: `string`
    },

    sens: {
      sql: `sens_operation`,
      type: `string`
    }
  }
});
