# Entrepôt de Données Bancaire - Cameroun

## Présentation
Ce projet contient une architecture BI complète pour un entrepôt de données bancaires :
- `backend-finance/backend-api` : API Express connectée à Cube.js pour exposer des dashboards
- `agency-strategy-tab-2` : application Next.js qui consomme les données réelles du backend
- `docker-compose.yml` : orchestrateur pour PostgreSQL, ETL, Cube.js, backend API et frontend
- `data_brute` / `data_transformee` : sources et résultats de l’ETL

## Lancer le projet en local
> Recommandé avec Docker pour garantir la cohérence des connexions entre PostgreSQL, Cube.js et l’API.

```bash
docker compose up -d
```

Puis ouvrir :
- Frontend : http://localhost:3001
- Backend API : http://localhost:5000
- Metabase : http://localhost:3000

## Vérifier que les services sont actifs
```bash
docker compose ps
```

## Backend API
Le backend expose les routes de dashboard suivantes :
- `GET /api/dashboard/overview`
- `GET /api/dashboard/temporal`
- `GET /api/dashboard/geographic`
- `GET /api/dashboard/agency`
- `GET /api/dashboard/channels`
- `GET /api/dashboard/strategy`
- `GET /health`

## Flux complet testé
Le frontend `agency-strategy-tab-2` est configuré pour appeler le backend via `NEXT_PUBLIC_FINANCE_API_URL=http://localhost:5000`.
Lorsque Docker est démarré, le frontend récupère les données réelles depuis l’API et n’utilise plus les mocks.

## Démarrage en développement local
### Backend
```bash
cd backend-finance/backend-api
npm install
npm run dev
```

### Frontend
```bash
cd agency-strategy-tab-2
npm install
npm run dev -- --hostname 0.0.0.0
```

Puis ouvrir le frontend sur http://localhost:3001.

## Remarques
- Le backend Docker utilise `CUBE_API_URL=http://cube:4000/cubejs-api/v1` et `DB_HOST=postgres`.
- Le fichier `.env` local du backend utilise `localhost` et est adapté à un démarrage hors conteneur.
- Si vous lancez tout avec Docker, utilisez `docker compose logs -f backend-api` pour suivre les erreurs.
