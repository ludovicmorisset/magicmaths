# Application d'exercices de mathématiques

Application web statique (HTML/CSS/JS) pour s'entraîner en mathématiques, servie par Nginx et déployable via Docker.

## Modules disponibles

- Tables de multiplication (tables de 1 à 10)
- Tables d'addition (tables de 1 à 10)
- Additions aléatoires (3 niveaux : 0-9, 0-49, 0-99)
- Compléments à 10 ou à 100
- Tables de soustraction (tables de 1 à 10)
- Lecture de l'heure sur horloge analogique (format HH:MM)
- Calcul du rendu de monnaie (euros et centimes)
- Exercices de probabilités (réponses en pourcentage)

Chaque exercice comporte 10 questions, un score final et un récapitulatif des réponses.

## Prérequis

- Docker 24+
- Docker Compose (`docker compose`)
- Réseau Docker externe `reseau_interne` (utilisé par `docker-compose.yml`)

## Installation rapide (Docker Compose)

1. Placez-vous dans le dossier du projet :
   ```bash
   cd /chemin/vers/mathematiques
   ```
2. Créez le réseau Docker externe (une seule fois) :
   ```bash
   docker network create reseau_interne
   ```
3. Lancez l'application :
   ```bash
   docker compose up -d --build
   ```
4. Ouvrez :
   - http://localhost:1987

## Publication de l'image Docker

1. Définissez le nom d'image :
   ```bash
   export MATHS_APP_IMAGE=docker.io/<votre-user>/mathematiques:1.0.0
   ```
2. Construisez :
   ```bash
   docker compose build
   ```
3. Connectez-vous :
   ```bash
   docker login
   ```
4. Publiez :
   ```bash
   docker compose push
   ```
5. Déployez avec la même variable :
   ```bash
   export MATHS_APP_IMAGE=docker.io/<votre-user>/mathematiques:1.0.0
   docker compose up -d
   ```

## Commandes utiles

- Démarrer/reconstruire : `docker compose up -d --build`
- Journaux : `docker compose logs -f`
- Arrêter : `docker compose down`
- Valider la configuration : `docker compose config`

## Structure du projet

- `Dockerfile` : image Nginx avec les ressources statiques
- `docker-compose.yml` : orchestration locale/serveur
- `nginx.conf` : serveur HTTP, cache, gzip, sécurité, `/healthz`
- `*.html`, `*.js`, `styles.css` : interface frontend
- `img/fond-ecran.png` : fond de l'interface

## Sécurité et performance

- En-têtes HTTP de sécurité (CSP, X-Frame-Options, etc.)
- Compression gzip
- Cache navigateur pour les ressources statiques
- Point d'accès de santé : `/healthz`
- Healthcheck Docker actif

## Dépannage

1. Le service ne démarre pas :
   - `docker compose logs -f`
   - `docker compose config`
2. L'application n'est pas accessible :
   - Vérifiez le port `1987`
   - Testez : `curl http://localhost:1987/healthz`
3. Erreur réseau Docker :
   - Vérifiez `docker network ls | grep reseau_interne`
   - Créez-le si nécessaire : `docker network create reseau_interne`
