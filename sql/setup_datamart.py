#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script d'automatisation post-ETL pour le Data Warehouse bancaire.
Objectifs :
  1. Création des index de performance sur la table de faits.
  2. Création des vues du Datamart pour les analyses décisionnelles.
"""

import argparse
import psycopg2

def run_datamart_setup(db_config: dict):
    print("[1/2] Connexion à PostgreSQL pour la configuration du Datamart...")
    try:
        conn = psycopg2.connect(**db_config)
        conn.autocommit = True  # Permet d'exécuter chaque bloc directement
        cursor = conn.cursor()

        # ============================================================
        # 13. CRÉATION DES INDEX
        # ============================================================
        print("\n--> Étape 13 : Création des index sur Fact_Transactions...")
        indexes = {
            "idx_fact_temps": "CREATE INDEX IF NOT EXISTS idx_fact_temps ON warehouse.Fact_Transactions(id_temps);",
            "idx_fact_zone": "CREATE INDEX IF NOT EXISTS idx_fact_zone ON warehouse.Fact_Transactions(id_zone);",
            "idx_fact_agence": "CREATE INDEX IF NOT EXISTS idx_fact_agence ON warehouse.Fact_Transactions(id_agence);",
            "idx_fact_client": "CREATE INDEX IF NOT EXISTS idx_fact_client ON warehouse.Fact_Transactions(id_client);",
            "idx_fact_compte": "CREATE INDEX IF NOT EXISTS idx_fact_compte ON warehouse.Fact_Transactions(id_compte);",
            "idx_fact_type_operation": "CREATE INDEX IF NOT EXISTS idx_fact_type_operation ON warehouse.Fact_Transactions(id_type_operation);",
            "idx_fact_canal": "CREATE INDEX IF NOT EXISTS idx_fact_canal ON warehouse.Fact_Transactions(id_canal);",
            "idx_fact_concurrent": "CREATE INDEX IF NOT EXISTS idx_fact_concurrent ON warehouse.Fact_Transactions(id_concurrent);"
        }

        for name, query in indexes.items():
            cursor.execute(query)
            print(f"    [OK] Index créé ou existant : {name}")

        # Ensure datamart schema exists
        cursor.execute("CREATE SCHEMA IF NOT EXISTS datamart;")

        # ============================================================
        # 14. CRÉATION DES VUES DATAMART
        # ============================================================
        print("\n--> Étape 14 : Création des vues analytiques dans le schéma 'datamart'...")

        # 14.1 Vue analyse temporelle
        print("    [Vue] Génération de : vue_transactions_annuelles")
        cursor.execute("""
        CREATE OR REPLACE VIEW datamart.vue_transactions_annuelles AS 
        SELECT    
            t.annee,    
            SUM(f.montant) AS montant_total,    
            SUM(f.frais_operation) AS total_frais,    
            COUNT(*) AS nombre_transactions 
        FROM warehouse.Fact_Transactions f 
        JOIN warehouse.dim_temps t ON f.id_temps = t.id_temps 
        GROUP BY t.annee 
        ORDER BY t.annee;
        """)

        # 14.2 Vue analyse geographique
        print("    [Vue] Génération de : vue_analyse_geographique")
        cursor.execute("""
        CREATE OR REPLACE VIEW datamart.vue_analyse_geographique AS 
        SELECT    
            z.region,    
            z.departement,    
            z.arrondissement,    
            z.ville,    
            z.quartier,    
            SUM(f.montant) AS montant_total,    
            SUM(f.frais_operation) AS total_frais,    
            COUNT(*) AS nombre_transactions 
        FROM warehouse.Fact_Transactions f 
        JOIN warehouse.dim_zone_geographique z ON f.id_zone = z.id_zone 
        GROUP BY z.region, z.departement, z.arrondissement, z.ville, z.quartier;
        """)

        # 14.3 Vue performance des agences
        print("    [Vue] Génération de : vue_performance_agence")
        cursor.execute("""
        CREATE OR REPLACE VIEW datamart.vue_performance_agence AS 
        SELECT    
            a.nom_agence,    
            a.type_agence,    
            a.statut_agence,    
            SUM(f.montant) AS montant_total,    
            SUM(f.frais_operation) AS total_frais,    
            COUNT(*) AS nombre_transactions 
        FROM warehouse.Fact_Transactions f 
        JOIN warehouse.dim_agence a ON f.id_agence = a.id_agence 
        GROUP BY a.nom_agence, a.type_agence, a.statut_agence;
        """)

        # 14.4 Vue analyse des canaux
        print("    [Vue] Génération de : vue_transactions_par_canal")
        cursor.execute("""
        CREATE OR REPLACE VIEW datamart.vue_transactions_par_canal AS 
        SELECT    
            c.nom_canal,    
            c.type_canal,    
            SUM(f.montant) AS montant_total,    
            COUNT(*) AS nombre_transactions 
        FROM warehouse.Fact_Transactions f 
        JOIN warehouse.dim_canal c ON f.id_canal = c.id_canal 
        GROUP BY c.nom_canal, c.type_canal;
        """)

        # 14.5 Vue analyse des produits bancaires
        print("    [Vue] Génération de : vue_transactions_par_produit")
        cursor.execute("""
        CREATE OR REPLACE VIEW datamart.vue_transactions_par_produit AS 
        SELECT    
            cp.type_compte,    
            cp.produit_bancaire,    
            SUM(f.montant) AS montant_total,    
            COUNT(*) AS nombre_transactions 
        FROM warehouse.Fact_Transactions f 
        JOIN warehouse.dim_compte cp ON f.id_compte = cp.id_compte 
        GROUP BY cp.type_compte, cp.produit_bancaire;
        """)

        print("\n[OK] Tout le processus d'indexation et de création des vues a réussi !")
        
    except Exception as e:
        print(f"\n[ERREUR] Échec de la configuration SQL : {e}")
    finally:
        if 'conn' in locals():
            cursor.close()
            conn.close()

def main():
    parser = argparse.ArgumentParser(description="Automatisation Datamart et Indexation.")
    parser.add_argument("--host", default="postgres", help="Hôte PostgreSQL")
    parser.add_argument("--database", default="banque_dw", help="Nom de la base")
    parser.add_argument("--user", default="postgres", help="Utilisateur")
    parser.add_argument("--password", default="root", help="Mot de passe")
    parser.add_argument("--port", default="5432", help="Port")
    args = parser.parse_args()

    db_config = {
        "host": args.host, "database": args.database, "user": args.user,
        "password": args.password, "port": args.port
    }

    run_datamart_setup(db_config)

if __name__ == "__main__":
    main()
