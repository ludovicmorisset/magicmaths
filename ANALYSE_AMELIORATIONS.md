# Analyse du projet et pistes d'amélioration

## Vue d'ensemble
Le projet est une application web statique (HTML/CSS/JS) servie via Nginx et conteneurisée avec Docker. L'application est fonctionnelle, lisible, et simple à déployer.

## Priorités recommandées

### 1) Réduire la duplication de code JavaScript (priorité haute)
**Constat** : les fichiers `addition.js`, `multiplication.js`, `subtraction.js` et `random-addition.js` partagent une logique presque identique (gestion de session, progression, score, boutons, rendu des résultats).

**Amélioration** : créer une classe de base `BaseQuizGame` puis spécialiser la génération des questions (addition, multiplication, soustraction, aléatoire).

**Bénéfice** :
- maintenance simplifiée;
- corrections plus rapides (un seul endroit);
- réduction du risque de divergence de comportement.

---

### 2) Externaliser les styles du menu de `index.html` (priorité haute)
**Constat** : `index.html` contient un bloc `<style>` qui duplique des règles déjà présentes dans `styles.css`.

**Amélioration** : déplacer toutes les règles du menu vers `styles.css` et supprimer le CSS inline.

**Bénéfice** :
- source de vérité unique;
- meilleure maintenabilité;
- allègement du HTML.

---

### 3) Corriger/optimiser le `docker-compose.yml` (priorité haute)
**Constat** :
- Le service définit à la fois `build` et une image distante + `pull_policy: always`.
- Un volume `static_content` est monté sur `/usr/share/nginx/html`, ce qui peut masquer les fichiers copiés au build.

**Amélioration** :
- choisir **soit** build local (`build: .`) **soit** image distante, pas les deux pour ce flux;
- supprimer le volume si le contenu est déjà embarqué dans l'image.

**Bénéfice** : déploiement plus prévisible, moins de surprises en production.

---

### 4) Renforcer l'accessibilité (priorité moyenne)
**Constat** :
- Le clavier numérique est composé de `<button class="key">` sans `aria-label` dédiés.
- Les messages de feedback (`error-message`, `success-message`) n'annoncent pas explicitement les changements aux lecteurs d'écran.

**Amélioration** :
- ajouter des `aria-label` explicites sur les boutons;
- ajouter `aria-live="polite"` sur les conteneurs de message;
- ajouter des labels associés pour les champs de réponse.

**Bénéfice** : meilleur usage sur technologies d'assistance et conformité accrue.

---

### 5) Ajouter un minimum de qualité logicielle (priorité moyenne)
**Constat** : pas de scripts de vérification/lint/tests automatisés.

**Amélioration** :
- ajouter un `package.json` léger avec `eslint` + `prettier`;
- ajouter un test E2E minimal (Playwright) pour valider un parcours utilisateur;
- intégrer les checks dans CI (GitHub Actions).

**Bénéfice** : régression détectée tôt, qualité plus stable.

---

### 6) Simplifier la configuration Nginx (priorité moyenne)
**Constat** :
- Le CSP autorise `style-src 'unsafe-inline'`.
- La route SPA (`try_files ... /index.html`) est active, alors que l'app n'est pas une SPA stricte.

**Amélioration** :
- retirer le CSS inline pour pouvoir supprimer `'unsafe-inline'`;
- ajuster `try_files` selon le comportement souhaité (fichiers statiques stricts vs fallback global).

**Bénéfice** : sécurité et comportement HTTP plus explicites.

---

### 7) Clarifier la documentation d'exploitation (priorité faible à moyenne)
**Constat** : README orienté Portainer, mais peu d'instructions de développement local.

**Amélioration** :
- ajouter un bloc "Développement local" (ex: `docker compose up --build`);
- documenter la structure des fichiers et conventions de code;
- ajouter une section "Roadmap".

**Bénéfice** : onboarding plus rapide pour d'autres contributeurs.

## Plan de mise en œuvre conseillé (progressif)
1. **Quick wins (1 PR)** : externalisation CSS `index.html` + suppression duplication évidente.
2. **Refactor JS (1 PR)** : base commune + modules par type d'exercice.
3. **DevEx/CI (1 PR)** : lint + tests + workflow CI.
4. **Accessibilité/Sécurité (1 PR)** : ARIA + CSP durcie.
5. **Docs (1 PR)** : README enrichi pour dev + ops.

## Impact attendu
- Moins de bugs lors des évolutions.
- Déploiements plus prédictibles.
- Meilleure qualité perçue (UX/accessibilité/sécurité).
- Projet plus facile à reprendre et à faire évoluer.
