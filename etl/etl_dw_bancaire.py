#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
ETL Python complet pour le Data Warehouse bancaire en schéma en étoile.
Inclus : Extraction, Transformation, et Chargement AUTOMATIQUE dans PostgreSQL.
"""

import argparse
import re
import unicodedata
from pathlib import Path
from datetime import date, datetime
import pandas as pd
import psycopg2
from psycopg2 import extras

# ============================================================
# Fonctions utilitaires de nettoyage
# ============================================================

def strip_accents(value: str) -> str:
    if pd.isna(value):
        return ""
    value = str(value).strip()
    return "".join(
        c for c in unicodedata.normalize("NFD", value)
        if unicodedata.category(c) != "Mn"
    )

def norm_text(value: str) -> str:
    value = strip_accents(value).lower()
    value = re.sub(r"\s+", " ", value)
    return value.strip()

def clean_ville(value: str) -> str:
    v = norm_text(value)
    mapping = {
        "dla": "Douala", "douala": "Douala",
        "yde": "Yaoundé", "yaounde": "Yaoundé", "yaoundé": "Yaoundé",
        "baf": "Bafoussam", "bafoussam": "Bafoussam",
        "dschang": "Dschang", "dsc": "Dschang",
        "garoua": "Garoua", "maroua": "Maroua", "bertoua": "Bertoua",
        "buea": "Buea", "limbe": "Limbe", "kribi": "Kribi", "bamenda": "Bamenda",
        "ngaoundere": "Ngaoundéré", "ngaoundéré": "Ngaoundéré",
        "nkongsamba": "Nkongsamba", "foumban": "Foumban", "mbouda": "Mbouda",
        "mokolo": "Mokolo", "batouri": "Batouri", "tiko": "Tiko", "ebolowa": "Ebolowa",
    }
    return mapping.get(v, str(value).strip().title())

def clean_quartier(value: str) -> str:
    q = norm_text(value)
    mapping = {
        "bonamousadi": "Bonamoussadi", "bonamoussadi": "Bonamoussadi",
        "biyem assi": "Biyem-Assi", "biyem-assi": "Biyem-Assi",
        "mboamanga": "Mboa Manga", "mboa manga": "Mboa Manga",
        "centre ville": "Centre-ville", "centre-ville": "Centre-ville", "centre": "Centre-ville",
        "new bell": "New Bell", "akwa": "Akwa", "bassa": "Bassa",
        "bonaberi": "Bonabéri", "bonabéri": "Bonabéri",
        "makepe": "Makepe", "japoma": "Japoma", "bastos": "Bastos",
        "mvan": "Mvan", "mokolo": "Mokolo", "essos": "Essos",
        "nkolbisson": "Nkolbisson", "campus": "Campus", "foto": "Foto", "molyko": "Molyko",
    }
    return mapping.get(q, str(value).strip().title())

def parse_date(value):
    if pd.isna(value) or str(value).strip() == "":
        return pd.NaT
    value = str(value).strip()
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%d/%m/%Y"):
        try:
            return pd.to_datetime(value, format=fmt).date()
        except Exception:
            pass
    try:
        return pd.to_datetime(value, dayfirst=True, errors="coerce").date()
    except Exception:
        return pd.NaT

def safe_decimal(series):
    return pd.to_numeric(series, errors="coerce")

def clean_sexe(value: str) -> str:
    v = norm_text(value)
    if v in ("m", "homme", "masculin"): return "M"
    if v in ("f", "femme", "feminin", "féminin"): return "F"
    return "Non renseigné"

def age_to_tranche(age):
    if pd.isna(age): return "Non renseigné"
    age = int(age)
    if 18 <= age <= 25: return "18-25 ans"
    if 26 <= age <= 35: return "26-35 ans"
    if 36 <= age <= 45: return "36-45 ans"
    if 46 <= age <= 60: return "46-60 ans"
    return "60 ans et plus"

def clean_operation(value: str) -> str:
    v = norm_text(value)
    mapping = {
        "dep": "DEP", "depot": "DEP", "dépôt": "DEP",
        "ret": "RET", "retrait": "RET",
        "vir": "VIR", "virement": "VIR",
        "remb": "REMB", "remboursement credit": "REMB", "remb_credit": "REMB",
        "frm": "FRM", "frais tenue compte": "FRM", "frais": "FRM", "frais de tenue de compte": "FRM",
        "int": "INT", "interets credit": "INT", "interet": "INT", "intérêts crédit": "INT",
        "dec": "DEC", "decaissement credit": "DEC", "credit_decaisse": "DEC", "décaissement crédit": "DEC",
        "trf": "TRF", "transfert sortant": "TRF", "transfert_out": "TRF",
    }
    return mapping.get(v, str(value).strip().upper())

def clean_canal(value: str) -> str:
    v = norm_text(value)
    mapping = {
        "guichet": "Guichet", "agence": "Guichet",
        "mobile money": "Mobile Money", "momo": "Mobile Money", "orange money": "Mobile Money",
        "app mobile": "App Mobile", "application mobile": "App Mobile", "appmobile": "App Mobile",
        "agent terrain": "Agent terrain", "agent": "Agent terrain",
        "ussd": "USSD", "virement": "Virement",
    }
    return mapping.get(v, str(value).strip())

def write_csv(df: pd.DataFrame, path: Path):
    df.to_csv(path, index=False, encoding="utf-8-sig")


# ============================================================
# ÉTAPE DE CHARGEMENT AUTOMATIQUE DANS POSTGRESQL (LOAD)
# ============================================================

def execute_database_ddl(cursor):
    """Crée proprement l'infrastructure des tables cibles dans PostgreSQL."""
    print("[PostgreSQL] Création des schémas et des structures de tables...")
    
    cursor.execute("CREATE SCHEMA IF NOT EXISTS warehouse;")
    cursor.execute("CREATE SCHEMA IF NOT EXISTS datamart;")
    
    # Suppression des tables si elles existent déjà pour éviter les conflits au re-run
    cursor.execute("DROP TABLE IF EXISTS warehouse.Fact_Transactions CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS warehouse.dim_temps CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS warehouse.dim_zone_geographique CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS warehouse.dim_agence CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS warehouse.dim_client CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS warehouse.dim_compte CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS warehouse.dim_type_operation CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS warehouse.dim_canal CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS warehouse.dim_institution_concurrente CASCADE;")

    # DDL des 8 Dimensions
    cursor.execute("""
    CREATE TABLE warehouse.dim_temps (
        id_temps INT PRIMARY KEY, date_complete DATE NOT NULL, jour INT NOT NULL,
        mois INT NOT NULL, trimestre INT NOT NULL, annee INT NOT NULL,
        jour_semaine VARCHAR(20) NOT NULL, est_weekend BOOLEAN NOT NULL
    );
    """)
    cursor.execute("""
    CREATE TABLE warehouse.dim_zone_geographique (
        id_zone INT PRIMARY KEY, region VARCHAR(100) NOT NULL, departement VARCHAR(100) NOT NULL,
        arrondissement VARCHAR(100) NOT NULL, ville VARCHAR(100) NOT NULL, quartier VARCHAR(100) NOT NULL,
        latitude DECIMAL(9,6), longitude DECIMAL(9,6)
    );
    """)
    cursor.execute("""
    CREATE TABLE warehouse.dim_agence (
        id_agence INT PRIMARY KEY, code_agence VARCHAR(20) NOT NULL, nom_agence VARCHAR(100) NOT NULL,
        type_agence VARCHAR(50), date_ouverture DATE, statut_agence VARCHAR(20)
    );
    """)
    cursor.execute("""
    CREATE TABLE warehouse.dim_client (
        id_client INT PRIMARY KEY, code_client VARCHAR(50) NOT NULL, sexe VARCHAR(10),
        tranche_age VARCHAR(30), profession VARCHAR(100), secteur_activite VARCHAR(100),
        type_client VARCHAR(50), statut_client VARCHAR(20), date_adhesion DATE
    );
    """)
    cursor.execute("""
    CREATE TABLE warehouse.dim_compte (
        id_compte INT PRIMARY KEY, numero_compte VARCHAR(50) NOT NULL, type_compte VARCHAR(50) NOT NULL,
        produit_bancaire VARCHAR(100), statut_compte VARCHAR(20), date_ouverture DATE
    );
    """)
    cursor.execute("""
    CREATE TABLE warehouse.dim_type_operation (
        id_type_operation INT PRIMARY KEY, code_operation VARCHAR(20) NOT NULL,
        libelle_operation VARCHAR(100) NOT NULL, categorie_operation VARCHAR(50), sens_operation VARCHAR(2)
    );
    """)
    cursor.execute("""
    CREATE TABLE warehouse.dim_canal (
        id_canal INT PRIMARY KEY, nom_canal VARCHAR(50) NOT NULL, type_canal VARCHAR(20) NOT NULL
    );
    """)
    cursor.execute("""
    CREATE TABLE warehouse.dim_institution_concurrente (
        id_concurrent INT PRIMARY KEY, nom_institution VARCHAR(100) NOT NULL,
        type_institution VARCHAR(50), categorie_institution VARCHAR(50)
    );
    """)

    # DDL Table de faits unique
    cursor.execute("""
    CREATE TABLE warehouse.Fact_Transactions (
        id_transaction INT PRIMARY KEY,
        id_temps INT NOT NULL REFERENCES warehouse.dim_temps(id_temps),
        id_zone INT NOT NULL REFERENCES warehouse.dim_zone_geographique(id_zone),
        id_agence INT NOT NULL REFERENCES warehouse.dim_agence(id_agence),
        id_client INT NOT NULL REFERENCES warehouse.dim_client(id_client),
        id_compte INT NOT NULL REFERENCES warehouse.dim_compte(id_compte),
        id_type_operation INT NOT NULL REFERENCES warehouse.dim_type_operation(id_type_operation),
        id_canal INT NOT NULL REFERENCES warehouse.dim_canal(id_canal),
        id_concurrent INT NOT NULL REFERENCES warehouse.dim_institution_concurrente(id_concurrent),
        montant DECIMAL(18,2) NOT NULL,
        frais_operation DECIMAL(12,2) NOT NULL DEFAULT 0.00
    );
    """)

def bulk_insert_dataframe(cursor, table_name, df):
    """Méthode d'insertion de masse ultra-rapide (Bulk insert)."""
    columns = ",".join(df.columns)
    query = f"INSERT INTO {table_name} ({columns}) VALUES %s"
    
    # Remplacement des valeurs NaT/NaN de pandas par des objets None (interprétés comme NULL par SQL)
    data_to_insert = [tuple(None if pd.isna(item) else item for item in row) for row in df.itertuples(index=False)]
    
    extras.execute_values(cursor, query, data_to_insert)
    print(f"[PostgreSQL] {len(df)} lignes insérées avec succès dans {table_name}.")


# ============================================================
# ETL Principal
# ============================================================

def run_etl(input_dir: Path, output_dir: Path, db_config: dict):
    input_dir = Path(input_dir)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # ----------------------------
    # E = Extraction
    # ----------------------------
    print("[1/3] Étape EXTRACT : Chargement des fichiers plats bruts...")
    zones = pd.read_csv(input_dir / "source_zones_economiques_brutes.csv", dtype=str)
    agences = pd.read_csv(input_dir / "source_agences_brutes.csv", dtype=str)
    clients = pd.read_csv(input_dir / "source_clients_bruts.csv", dtype=str)
    comptes = pd.read_csv(input_dir / "source_comptes_bruts.csv", dtype=str)
    concurrents = pd.read_csv(input_dir / "source_institutions_concurrentes_brutes.csv", dtype=str)
    operations = pd.read_csv(input_dir / "source_referentiel_operations_brut.csv", dtype=str)
    canaux = pd.read_csv(input_dir / "source_referentiel_canaux_brut.csv", dtype=str)
    transactions = pd.read_csv(input_dir / "source_transactions_brutes.csv", dtype=str)

    rapport = [
        "===== RAPPORT ETL DATA WAREHOUSE BANCAIRE =====", "",
        "1) EXTRACTION",
        f"Zones brutes : {len(zones)}", f"Agences brutes : {len(agences)}",
        f"Clients bruts : {len(clients)}", f"Comptes bruts : {len(comptes)}",
        f"Institutions concurrentes brutes : {len(concurrents)}", f"Transactions brutes : {len(transactions)}", ""
    ]

    # ----------------------------
    # T = Transformation / Nettoyage
    # ----------------------------
    print("[2/3] Étape TRANSFORM : Redressement et application des règles métiers...")

    # Nettoyage des zones
    for col in ["ville", "quartier"]:
        if col in zones.columns:
            zones[col] = zones[col].fillna("").astype(str)

    zones["ville_clean"] = zones["ville"].apply(clean_ville)
    zones["quartier_clean"] = zones["quartier"].apply(clean_quartier)
    zones["latitude"] = safe_decimal(zones["latitude"])
    zones["longitude"] = safe_decimal(zones["longitude"])

    dim_zone = (
        zones[["region", "departement", "arrondissement", "ville_clean", "quartier_clean", "latitude", "longitude"]]
        .drop_duplicates()
        .rename(columns={"ville_clean": "ville", "quartier_clean": "quartier"})
        .sort_values(["region", "ville", "quartier"])
        .reset_index(drop=True)
    )
    dim_zone.insert(0, "id_zone", range(1, len(dim_zone) + 1))
    zone_map = {(norm_text(row["ville"]), norm_text(row["quartier"])): int(row["id_zone"]) for _, row in dim_zone.iterrows()}

    # Nettoyage agences
    agences["date_ouverture_clean"] = agences["date_ouverture"].apply(parse_date)
    agences = agences.drop_duplicates(subset=["code_agence"]).copy()
    dim_agence = agences[["code_agence", "nom_agence", "type_agence", "date_ouverture_clean", "statut_agence"]].rename(columns={"date_ouverture_clean": "date_ouverture"})
    dim_agence = dim_agence.sort_values("code_agence").reset_index(drop=True)
    dim_agence.insert(0, "id_agence", range(1, len(dim_agence) + 1))
    agence_map = {row["code_agence"]: int(row["id_agence"]) for _, row in dim_agence.iterrows()}

    # Nettoyage clients
    clients = clients.drop_duplicates(subset=["code_client"]).copy()
    clients["sexe_clean"] = clients["sexe"].apply(clean_sexe)
    clients["date_naissance_clean"] = clients["date_naissance"].apply(parse_date)
    clients["date_adhesion_clean"] = clients["date_adhesion"].apply(parse_date)

    reference_date = date(2026, 12, 31)
    clients["age"] = clients["date_naissance_clean"].apply(
        lambda d: reference_date.year - d.year - ((reference_date.month, reference_date.day) < (d.month, d.day)) if pd.notna(d) else pd.NA
    )
    clients["tranche_age"] = clients["age"].apply(age_to_tranche)

    dim_client = clients[["code_client", "sexe_clean", "tranche_age", "profession", "secteur_activite", "type_client", "statut_client", "date_adhesion_clean"]].rename(columns={"sexe_clean": "sexe", "date_adhesion_clean": "date_adhesion"})
    dim_client = dim_client.sort_values("code_client").reset_index(drop=True)
    dim_client.insert(0, "id_client", range(1, len(dim_client) + 1))
    client_map = {row["code_client"]: int(row["id_client"]) for _, row in dim_client.iterrows()}

    # Nettoyage comptes
    comptes = comptes.drop_duplicates(subset=["numero_compte"]).copy()
    comptes["date_ouverture_clean"] = comptes["date_ouverture"].apply(parse_date)
    dim_compte = comptes[["numero_compte", "type_compte", "produit_bancaire", "statut_compte", "date_ouverture_clean"]].rename(columns={"date_ouverture_clean": "date_ouverture"})
    dim_compte = dim_compte.sort_values("numero_compte").reset_index(drop=True)
    dim_compte.insert(0, "id_compte", range(1, len(dim_compte) + 1))
    compte_map = {row["numero_compte"]: int(row["id_compte"]) for _, row in dim_compte.iterrows()}

    # Nettoyage type_operation
    operations["code_operation"] = operations["code_operation"].apply(clean_operation)
    operations = operations.drop_duplicates(subset=["code_operation"]).copy()
    dim_type_operation = operations[["code_operation", "libelle_operation", "categorie_operation", "sens_operation"]].sort_values("code_operation").reset_index(drop=True)
    dim_type_operation.insert(0, "id_type_operation", range(1, len(dim_type_operation) + 1))
    operation_map = {row["code_operation"]: int(row["id_type_operation"]) for _, row in dim_type_operation.iterrows()}

    # Nettoyage canal
    canaux["nom_canal"] = canaux["nom_canal"].apply(clean_canal)
    canaux = canaux.drop_duplicates(subset=["nom_canal"]).copy()
    dim_canal = canaux[["nom_canal", "type_canal"]].sort_values("nom_canal").reset_index(drop=True)
    dim_canal.insert(0, "id_canal", range(1, len(dim_canal) + 1))
    canal_map = {row["nom_canal"]: int(row["id_canal"]) for _, row in dim_canal.iterrows()}

    # Nettoyage institutions concurrentes
    concurrents = concurrents.drop_duplicates(subset=["code_concurrent"]).copy()
    dim_concurrent = concurrents[["code_concurrent", "nom_institution", "type_institution", "categorie_institution"]].sort_values("code_concurrent").reset_index(drop=True)
    dim_concurrent.insert(0, "id_concurrent", range(1, len(dim_concurrent) + 1))
    concurrent_map = {row["code_concurrent"]: int(row["id_concurrent"]) for _, row in dim_concurrent.iterrows()}

    # Nettoyage transactions et liaison de la Table de Faits
    transactions["date_clean"] = transactions["date_operation"].apply(parse_date)
    transactions["operation_clean"] = transactions["operation"].apply(clean_operation)
    transactions["canal_clean"] = transactions["canal"].apply(clean_canal)
    transactions["ville_clean"] = transactions["ville_operation"].apply(clean_ville)
    transactions["quartier_clean"] = transactions["quartier_operation"].apply(clean_quartier)
    transactions["montant_clean"] = safe_decimal(transactions["montant"])
    transactions["frais_clean"] = safe_decimal(transactions["frais_operation"])

    transactions["statut_norm"] = transactions["statut_transaction"].apply(norm_text)
    transactions_valides = transactions[transactions["statut_norm"].isin(["validee", "validée"])].copy()

    transactions_valides["id_temps"] = transactions_valides["date_clean"].apply(lambda d: int(d.strftime("%Y%m%d")) if pd.notna(d) else pd.NA)

    # Génération axe temporel complet
    min_date, max_date = transactions_valides["date_clean"].dropna().min(), transactions_valides["date_clean"].dropna().max()
    dates = pd.date_range(min_date, max_date, freq="D")
    jours_fr = {0: "Lundi", 1: "Mardi", 2: "Mercredi", 3: "Jeudi", 4: "Vendredi", 5: "Samedi", 6: "Dimanche"}

    dim_temps = pd.DataFrame({"date_complete": dates.date})
    dim_temps["id_temps"] = dim_temps["date_complete"].apply(lambda d: int(d.strftime("%Y%m%d")))
    dim_temps["jour"] = dim_temps["date_complete"].apply(lambda d: d.day)
    dim_temps["mois"] = dim_temps["date_complete"].apply(lambda d: d.month)
    dim_temps["trimestre"] = dim_temps["date_complete"].apply(lambda d: (d.month - 1) // 3 + 1)
    dim_temps["annee"] = dim_temps["date_complete"].apply(lambda d: d.year)
    dim_temps["jour_semaine"] = dim_temps["date_complete"].apply(lambda d: jours_fr[d.weekday()])
    dim_temps["est_weekend"] = dim_temps["date_complete"].apply(lambda d: d.weekday() >= 5)
    dim_temps = dim_temps[["id_temps", "date_complete", "jour", "mois", "trimestre", "annee", "jour_semaine", "est_weekend"]]

    # Mapping des clés vers la table de faits
    transactions_valides["id_zone"] = transactions_valides.apply(lambda r: zone_map.get((norm_text(r["ville_clean"]), norm_text(r["quartier_clean"]))), axis=1)
    transactions_valides["id_agence"] = transactions_valides["code_agence"].map(agence_map)
    transactions_valides["id_client"] = transactions_valides["code_client"].map(client_map)
    transactions_valides["id_compte"] = transactions_valides["numero_compte"].map(compte_map)
    transactions_valides["id_type_operation"] = transactions_valides["operation_clean"].map(operation_map)
    transactions_valides["id_canal"] = transactions_valides["canal_clean"].map(canal_map)
    transactions_valides["id_concurrent"] = transactions_valides["code_concurrent_zone"].map(concurrent_map)

    avant_jointures = len(transactions_valides)
    fact = transactions_valides[["id_temps", "id_zone", "id_agence", "id_client", "id_compte", "id_type_operation", "id_canal", "id_concurrent", "montant_clean", "frais_clean"]].copy()
    fact = fact.dropna()
    apres_jointures = len(fact)

    for col in ["id_temps", "id_zone", "id_agence", "id_client", "id_compte", "id_type_operation", "id_canal", "id_concurrent"]:
        fact[col] = fact[col].astype(int)

    fact = fact.rename(columns={"montant_clean": "montant", "frais_clean": "frais_operation"}).reset_index(drop=True)
    fact.insert(0, "id_transaction", range(1, len(fact) + 1))

    # Sauvegarde de secours en CSV locaux
    write_csv(dim_temps, output_dir / "dim_temps.csv")
    write_csv(dim_zone, output_dir / "dim_zone_geographique.csv")
    write_csv(dim_agence, output_dir / "dim_agence.csv")
    write_csv(dim_client, output_dir / "dim_client.csv")
    write_csv(dim_compte, output_dir / "dim_compte.csv")
    write_csv(dim_type_operation, output_dir / "dim_type_operation.csv")
    write_csv(dim_canal, output_dir / "dim_canal.csv")
    write_csv(dim_concurrent.drop(columns=["code_concurrent"]), output_dir / "dim_institution_concurrente.csv")
    write_csv(fact, output_dir / "Fact_Transactions.csv")

    # ----------------------------
    # L = LOAD (CHARGEMENT POSTGRES)
    # ----------------------------
    print("[3/3] Étape LOAD : Insertion automatique dans la base de données...")
    try:
        conn = psycopg2.connect(**db_config)
        conn.autocommit = False  # Utilisation d'une transaction unique globale
        cursor = conn.cursor()
        
        # 1. Préparation de la base
        execute_database_ddl(cursor)
        
        # 2. Insertion des dimensions
        bulk_insert_dataframe(cursor, "warehouse.dim_temps", dim_temps)
        bulk_insert_dataframe(cursor, "warehouse.dim_zone_geographique", dim_zone)
        bulk_insert_dataframe(cursor, "warehouse.dim_agence", dim_agence)
        bulk_insert_dataframe(cursor, "warehouse.dim_client", dim_client)
        bulk_insert_dataframe(cursor, "warehouse.dim_compte", dim_compte)
        bulk_insert_dataframe(cursor, "warehouse.dim_type_operation", dim_type_operation)
        bulk_insert_dataframe(cursor, "warehouse.dim_canal", dim_canal)
        bulk_insert_dataframe(cursor, "warehouse.dim_institution_concurrente", dim_concurrent.drop(columns=["code_concurrent"]))
        
        # 3. Insertion de la table de faits
        bulk_insert_dataframe(cursor, "warehouse.Fact_Transactions", fact)
        
        # Validation définitive des données en base
        conn.commit()
        print("[OK] Base de données synchronisée et commitée à 100%.")
        
    except Exception as e:
        if 'conn' in locals(): conn.rollback()
        print(f"[ERREUR CRITIQUE] Le chargement SQL a échoué. Rollback appliqué. Détails : {e}")
        raise e
    finally:
        if 'conn' in locals():
            cursor.close()
            conn.close()

    # Finalisation du rapport texte
    rapport.extend([
        "2) TRANSFORMATION", f"Transactions valides avant jointures : {avant_jointures}",
        f"Transactions conservées après jointures : {apres_jointures}", "",
        "3) CHARGEMENT AUTOMATIQUE EN BASE REUSSI", f"Fact_Transactions finale : {len(fact)} lignes"
    ])
    (output_dir / "rapport_etl.txt").write_text("\n".join(rapport), encoding="utf-8")
    print(f"Rapport d'audit complet généré dans : {output_dir / 'rapport_etl.txt'}")


def main():
    parser = argparse.ArgumentParser(description="ETL Décisionnel Bancaire automatisé.")
    parser.add_argument("--input", required=True, help="Dossier des CSV bruts.")
    parser.add_argument("--output", required=True, help="Dossier de sortie des CSV nettoyés.")
    
    # Paramètres de connexion PostgreSQL par défaut (A adapter au besoin)
    parser.add_argument("--host", default="postgres", help="Hôte PostgreSQL")
    parser.add_argument("--database", default="banque_dw", help="Nom de la base de données")
    parser.add_argument("--user", default="postgres", help="Utilisateur PostgreSQL")
    parser.add_argument("--password", default="postgres", help="Mot de passe PostgreSQL")
    parser.add_argument("--port", default="5432", help="Port PostgreSQL")
    args = parser.parse_args()

    db_config = {
        "host": args.host, "database": args.database, "user": args.user,
        "password": args.password, "port": args.port
    }

    run_etl(Path(args.input), Path(args.output), db_config)

if __name__ == "__main__":
    main()
