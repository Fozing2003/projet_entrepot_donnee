cube(`Canaux`, {
  sql: `SELECT * FROM warehouse.dim_canal`,

  title: `Canaux`,

  dimensions: {
    id: {
      sql: `id_canal`,
      type: `number`,
      primaryKey: true
    },

    nom: {
      sql: `nom_canal`,
      type: `string`
    },

    type: {
      sql: `type_canal`,
      type: `string`
    }
  }
});
