# ORA Core OS Multi-LLM

Catalogue et installateur ORA deterministe pour fournir les fichiers, packs et recettes d'installation du dossier `Ora Agent Modulaire` vers differents environnements LLM.

## Regles produit

- Aucune dependance Gemini, OpenAI ou API LLM en runtime.
- Le chatbot et les compilateurs restent deterministes.
- Les fichiers sensibles ne doivent pas etre inclus dans la DB publique.
- Gemini / AI Studio peut etre une cible d'installation manuelle, pas une dependance de l'app.

## Run Locally

Prerequis: Node.js.

1. Installer les dependances:
   `npm install`
2. Optionnel: definir `ADMIN_PASSCODE` dans `.env.local` pour activer l'espace admin local.
3. Lancer l'app:
   `npm run dev`

## API DB ORA

- `GET /api/ora-db/summary`
- `GET /api/ora-db/files`
- `GET /api/ora-db/packs`
- `GET /api/install-recipes`

Source DB: `server/data/ora-agent-db`.
