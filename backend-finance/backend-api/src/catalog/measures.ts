export const measures = {

    revenu: {

        name: "revenu",

        cube: "Transactions.totalRevenue",

        synonyms: [

            "revenu",
            "revenus",
            "montant",
            "montants",
            "ca",
            "chiffre",
            "affaire"

        ]

    },

    transactions: {

        name: "transactions",

        cube: "Transactions.transactionCount",

        synonyms: [

            "transaction",
            "transactions",
            "operation",
            "operations"

        ]

    },

    frais: {

        name: "frais",

        cube: "Transactions.totalFees",

        synonyms: [

            "frais",
            "commission",
            "commissions"

        ]

    }

};