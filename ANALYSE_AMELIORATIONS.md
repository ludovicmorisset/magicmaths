# Analyse du projet et pistes d'amélioration

## État actuel

Le projet est une application web statique (HTML/CSS/JS) servie par Nginx et conteneurisée avec Docker.

Les points d'exploitation sont maintenant clarifiés :
- documentation d'installation simplifiée (`README.md`) ;
- chaîne Docker homogène (`Dockerfile`, `docker-compose.yml`, `nginx.conf`) ;
- point d'accès de santé `/healthz` pour la supervision.

## Priorités techniques recommandées

### 1) Réduire la duplication JavaScript (priorité haute)
**Constat** : `addition.js`, `multiplication.js`, `soustraction.js` et `addition-aleatoire.js` partagent une logique proche.

**Amélioration** : factoriser une base commune (ex. `JeuQuizBase`) et spécialiser la génération des questions.

---

### 2) Renforcer l'accessibilité (priorité moyenne)
**Constat** : certains composants interactifs peuvent être mieux exposés aux lecteurs d'écran.

**Amélioration** :
- compléter les `aria-label` des actions du clavier virtuel ;
- ajouter des zones `aria-live` pour les messages d'état.

---

### 3) Ajouter des contrôles qualité automatisés (priorité moyenne)
**Constat** : absence de linting/tests automatisés.

**Amélioration** :
- ESLint + Prettier ;
- test E2E minimal (Playwright) ;
- exécution en CI.

---

### 4) Clarifier la feuille de route produit (priorité faible)
**Pistes** :
- modes de difficulté supplémentaires ;
- export des scores ;
- progression par profil utilisateur.

## Plan de mise en œuvre conseillé

1. **Refactor JS** (factorisation logique commune)
2. **Accessibilité** (ARIA + feedback dynamique)
3. **Qualité** (lint/tests/intégration continue)
4. **Évolutions fonctionnelles**
