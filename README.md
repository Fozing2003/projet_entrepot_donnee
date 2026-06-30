# Entrepôt de Données Bancaire - Cameroun

## Lancer le projet
```bash
docker compose up
```
Puis ouvrir http://localhost:3000 pour accéder à Metabase.

## Architecture
- PostgreSQL 15 : schémas warehouse (8 dimensions + Fact_Transactions) et datamart (17 vues + 3 cubes)
- ETL Python : pandas + psycopg2
- Metabase : visualisation et tableaux de bord
