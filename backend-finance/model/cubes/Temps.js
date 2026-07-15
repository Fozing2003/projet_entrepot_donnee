cube(`Temps`, {
  sql: `SELECT * FROM warehouse.dim_temps`,

  title: `Temps`,

  dimensions: {
    id: {
      sql: `id_temps`,
      type: `number`,
      primaryKey: true
    },

    date: {
      sql: `date_complete`,
      type: `time`
    },

    jour: {
      sql: `jour`,
      type: `number`
    },

    mois: {
      sql: `mois`,
      type: `number`
    },

    trimestre: {
      sql: `trimestre`,
      type: `number`
    },

    annee: {
      sql: `annee`,
      type: `number`
    },

    jourSemaine: {
      sql: `jour_semaine`,
      type: `string`
    },

    weekend: {
      sql: `est_weekend`,
      type: `boolean`
    }
  }
});
