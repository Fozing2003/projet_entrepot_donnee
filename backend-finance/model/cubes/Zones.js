cube(`Zones`, {
  sql: `SELECT * FROM warehouse.dim_zone_geographique`,

  title: `Zones`,

  dimensions: {
    id: {
      sql: `id_zone`,
      type: `number`,
      primaryKey: true
    },

    region: {
      sql: `region`,
      type: `string`
    },

    departement: {
      sql: `departement`,
      type: `string`
    },

    arrondissement: {
      sql: `arrondissement`,
      type: `string`
    },

    ville: {
      sql: `ville`,
      type: `string`
    },

    quartier: {
      sql: `quartier`,
      type: `string`
    },

    latitude: {
      sql: `latitude`,
      type: `number`
    },

    longitude: {
      sql: `longitude`,
      type: `number`
    }
  }
});
