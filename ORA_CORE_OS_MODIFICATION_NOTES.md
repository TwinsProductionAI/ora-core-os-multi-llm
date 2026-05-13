# ORA Core OS - Notes de Modification

Date: 2026-05-12

## Objectif

Transformer l'export AI Studio ORA Core OS en app publiable GitHub qui sert de catalogue/installateur multi-LLM pour les fichiers publics du dossier `Ora Agent Modulaire`.

## CLI disponible

- `node`: disponible
- `npm`: disponible
- `gh`: disponible
- `gcloud`: non installe
- `gemini`: non installe

Conclusion: pas de CLI local fiable pour pousser directement dans AI Studio. Le flux propre est:

1. modifier/tester le code localement;
2. publier sur GitHub si besoin avec `gh`;
3. reinjecter dans AI Studio par remplacement/import manuel ou en donnant le patch/prompt a l'assistant AI Studio.

## Changements faits

- Suppression de la dependance runtime Gemini:
  - `@google/genai` retire de `package.json` et `package-lock.json`;
  - `GEMINI_API_KEY` retire de `.env.example`;
  - injection Vite `process.env.GEMINI_API_KEY` retiree.
- Ajout de la DB ORA:
  - `server/data/ora-agent-db/ora_agent_modulaire.catalog.json`;
  - `server/data/ora-agent-db/ora_agent_modulaire.packs.json`;
  - `server/data/ora-agent-db/installation_recipes.json`.
- Ajout API:
  - `GET /api/ora-db/summary`;
  - `GET /api/ora-db/files`;
  - `GET /api/ora-db/packs`;
  - `GET /api/install-recipes`.
- Ajout UI:
  - navigation `Install Center`;
  - File DB;
  - Pack Builder;
  - recettes par cible LLM;
  - export manifest JSON.
- Admin:
  - suppression du mot de passe hardcode;
  - auth locale via `ADMIN_PASSCODE` cote serveur.
- Determinisme:
  - suppression des usages `Math.random`;
  - score/estimation derives de donnees stables.

## Verification locale

Commandes executees:

```bash
npm install --package-lock-only --ignore-scripts
npm install --ignore-scripts
npm run lint
npm run build
```

Resultat:

- TypeScript OK.
- Build Vite OK.
- API DB OK: 101 fichiers publics, 4 packs, 6 recettes.
- Verification navigateur OK: `Install Center ORA`, `File DB`, `Pack Builder`, `No AI Runtime` visibles.

## Lancement local

```bash
npm run dev
```

URL:

```text
http://localhost:3001
```

## Reinjecter dans AI Studio

Option recommandee:

1. ouvrir l'app AI Studio cible;
2. donner a l'assistant le prompt `../07_AI_STUDIO_BRIDGE/AI_STUDIO_MODIFY_EXISTING_ORA_CORE_OS.md`;
3. utiliser cette copie locale comme reference de patch;
4. verifier apres generation:
   - aucune dependance Gemini/OpenAI/LLM API;
   - `Install Center` present;
   - routes API DB presentes;
   - admin sans mot de passe hardcode;
   - dossier sensible absent.

Option GitHub:

1. creer un repo public ou prive;
2. pousser le dossier `10_ORA_CORE_OS_MULTI_LLM_APP`;
3. garder `ADMIN_PASSCODE` hors repo.
