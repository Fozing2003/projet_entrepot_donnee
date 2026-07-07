import { pool } from "./metadata";


type CatalogField = {
    id: string;
    table: string;
    column: string;
    label: string;
    synonyms: string[];
};

function toLabel(column: string) {
    return column
        .replace(/_/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase());
}

function generateSynonyms(column: string): string[] {

    const base = column.toLowerCase();

    const map: Record<string, string[]> = {
        nom_agence: ["agence", "nom agence", "agences"],
        sexe: ["sexe", "genre"],
        profession: ["profession", "metier", "emploi"],
        region: ["region", "zone", "localisation"],
        montant: ["revenu", "montant", "somme", "ca"]
    };

    return map[base] || [base];
}

async function main() {

    console.log("Découverte des dimensions...");

    const result = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema='public'
        ORDER BY table_name;
    `);

    const columnsResult = await pool.query(`
        SELECT
            table_name,
            column_name,
            data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
    `);

    const dimensions = result.rows.filter(r =>
        r.table_name.startsWith("dim_")
    );

    const dimTables = new Set(dimensions.map(d => d.table_name));

    const dimColumns = columnsResult.rows.filter(row =>
        dimTables.has(row.table_name)
    );

    console.table(dimColumns);

    const fields: CatalogField[] = dimColumns.map(col => {

        return {
            id: `${col.table_name}.${col.column_name}`,
            table: col.table_name,
            column: col.column_name,
            label: toLabel(col.column_name),
            synonyms: generateSynonyms(col.column_name)
        };
    });

    console.log("Dimensions découvertes :");
    console.table(fields);
/*
    console.log("Génération du catalogue...");

    const catalog = {
        dimensions: fields,
        measures: [
            {
                id: "fact_revenus.montant",
                table: "fact_revenus",
                column: "montant",
                label: "Montant",
                synonyms: ["revenu", "montant", "somme", "ca"]
            }
        ],
        operators: [
            { id: "asc", order: "asc", synonyms: ["croissant", "ascendant"] },
            { id: "desc", order: "desc", synonyms: ["décroissant", "descendant"] }
        ],
        stopWords: ["le", "la", "les", "un", "une", "des", "de", "du"]
    };

    console.log("Catalogue généré :");
    console.log(JSON.stringify(catalog, null, 2));

    console.log("Écriture du catalogue dans le fichier catalog.json...");

    const fs = require("fs");
    const path = require("path");

    const filePath = path.join(__dirname, "./../catalog/catalog.json");

    fs.writeFileSync(filePath, JSON.stringify(catalog, null, 2));

    console.log(`Catalogue écrit dans le fichier ${filePath}`);
    */

    await pool.end();

}


main()
.catch(console.error);