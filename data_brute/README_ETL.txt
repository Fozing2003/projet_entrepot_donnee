Données brutes synthétiques pour ton projet de Data Warehouse bancaire.

Objectif :
Ces fichiers ne sont PAS déjà transformés en dimensions et table de faits.
Ils représentent des données sources brutes que tu peux importer dans des tables staging,
puis traiter toi-même avec ton ETL pour produire :
- dim_temps
- dim_zone_geographique
- dim_agence
- dim_client
- dim_compte
- dim_type_operation
- dim_canal
- dim_institution_concurrente
- Fact_Transactions

Fichiers fournis :
1. source_zones_economiques_brutes.csv
2. source_agences_brutes.csv
3. source_clients_bruts.csv
4. source_comptes_bruts.csv
5. source_institutions_concurrentes_brutes.csv
6. source_referentiel_operations_brut.csv
7. source_referentiel_canaux_brut.csv
8. source_transactions_brutes.csv
9. creation_tables_staging.sql

Volumes :
- Clients bruts : 6280 lignes
- Agences brutes : 140 lignes
- Comptes bruts : 9000 lignes
- Institutions concurrentes brutes : 100 lignes
- Transactions brutes : 150000 lignes
- Zones économiques brutes : 40 lignes

Période des transactions :
- 2018 à 2026

Remarque importante :
Certaines données contiennent volontairement des variations ou incohérences légères :
- Douala / DLA / douala
- Yaoundé / Yaounde / YDE
- Bonamoussadi / Bonamousadi
- dates sous plusieurs formats
- canaux écrits avec des variantes
- opérations écrites avec des codes ou libellés

Ces imperfections sont présentes pour te permettre de faire une vraie phase ETL :
extraction, nettoyage, transformation, normalisation, puis chargement dans ton schéma en étoile.
