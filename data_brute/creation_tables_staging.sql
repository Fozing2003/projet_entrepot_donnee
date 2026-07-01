-- Tables de staging pour importer les données brutes.
-- Toutes les colonnes sont volontairement en TEXT afin de permettre le nettoyage et la transformation ETL.

CREATE TABLE stg_zones_economiques_brutes (
    zone_source_id TEXT,
    region TEXT,
    departement TEXT,
    arrondissement TEXT,
    ville TEXT,
    quartier TEXT,
    latitude TEXT,
    longitude TEXT,
    population_estimee TEXT,
    revenu_moyen TEXT,
    taux_bancarisation TEXT,
    taux_croissance_economique TEXT,
    distance_agence_plus_proche_km TEXT
);

CREATE TABLE stg_agences_brutes (
    code_agence TEXT,
    nom_agence TEXT,
    type_agence TEXT,
    date_ouverture TEXT,
    statut_agence TEXT,
    region TEXT,
    departement TEXT,
    arrondissement TEXT,
    ville TEXT,
    quartier TEXT,
    latitude TEXT,
    longitude TEXT
);

CREATE TABLE stg_clients_bruts (
    code_client TEXT,
    nom TEXT,
    prenom TEXT,
    sexe TEXT,
    date_naissance TEXT,
    profession TEXT,
    secteur_activite TEXT,
    type_client TEXT,
    statut_client TEXT,
    date_adhesion TEXT,
    region_residence TEXT,
    departement_residence TEXT,
    arrondissement_residence TEXT,
    ville_residence TEXT,
    quartier_residence TEXT,
    telephone TEXT,
    email TEXT,
    revenu_mensuel_estime TEXT
);

CREATE TABLE stg_comptes_bruts (
    numero_compte TEXT,
    code_client TEXT,
    type_compte TEXT,
    produit_bancaire TEXT,
    statut_compte TEXT,
    date_ouverture TEXT,
    devise TEXT,
    solde_initial TEXT
);

CREATE TABLE stg_institutions_concurrentes_brutes (
    code_concurrent TEXT,
    nom_institution TEXT,
    type_institution TEXT,
    categorie_institution TEXT,
    region TEXT,
    departement TEXT,
    arrondissement TEXT,
    ville TEXT,
    quartier TEXT,
    nombre_agences_zone TEXT,
    distance_moyenne_km TEXT
);

CREATE TABLE stg_referentiel_operations_brut (
    code_operation TEXT,
    libelle_operation TEXT,
    categorie_operation TEXT,
    sens_operation TEXT
);

CREATE TABLE stg_referentiel_canaux_brut (
    nom_canal TEXT,
    type_canal TEXT
);

CREATE TABLE stg_transactions_brutes (
    reference_transaction TEXT,
    date_operation TEXT,
    code_agence TEXT,
    code_client TEXT,
    numero_compte TEXT,
    operation TEXT,
    canal TEXT,
    code_concurrent_zone TEXT,
    ville_operation TEXT,
    quartier_operation TEXT,
    montant TEXT,
    frais_operation TEXT,
    devise TEXT,
    statut_transaction TEXT
);
