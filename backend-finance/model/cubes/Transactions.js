cube(`Transactions`, {
  sql: `
    SELECT *
    FROM warehouse.Fact_Transactions
  `,

  title: `Transactions`,

  joins: {
    Agences: {
        relationship: `belongsTo`,
        sql: `${CUBE}.id_agence = ${Agences}.id_agence`
    },

    Clients: {
        relationship: `belongsTo`,
        sql: `${CUBE}.id_client = ${Clients}.id_client`
    },

    Temps: {
        relationship: `belongsTo`,
        sql: `${CUBE}.id_temps = ${Temps}.id_temps`
    },

    Zones: {
        relationship: `belongsTo`,
        sql: `${CUBE}.id_zone = ${Zones}.id_zone`
    },

    Comptes: {
        relationship: `belongsTo`,
        sql: `${CUBE}.id_compte = ${Comptes}.id_compte`
    },

    Canaux: {
        relationship: `belongsTo`,
        sql: `${CUBE}.id_canal = ${Canaux}.id_canal`
    },

    Operations: {
        relationship: `belongsTo`,
        sql: `${CUBE}.id_type_operation = ${Operations}.id_type_operation`
    },

    Concurrents: {
        relationship: `belongsTo`,
        sql: `${CUBE}.id_concurrent = ${Concurrents}.id_concurrent`
    }
 },

  measures: {
    transactionCount: {
      type: `count`,
      drillMembers: [transactionId]
    },

    totalRevenue: {
      sql: `montant`,
      type: `sum`,
      title: `Total Revenue`
    },

    averageRevenue: {
      sql: `montant`,
      type: `avg`
    },

    maxRevenue: {
      sql: `montant`,
      type: `max`
    },

    minRevenue: {
      sql: `montant`,
      type: `min`
    },

    totalFees: {
      sql: `frais_operation`,
      type: `sum`
    },

    averageFees: {
      sql: `frais_operation`,
      type: `avg`
    }
  },

  dimensions: {
    transactionId: {
      sql: `id_transaction`,
      type: `number`,
      primaryKey: true
    }
  }
});
