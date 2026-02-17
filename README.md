# Application d'exercices de mathématiques

Application web statique (HTML/CSS/JS) pour s'entraîner en mathématiques :
- Tables de multiplication
- Tables d'addition
- Additions aléatoires
- Compléments à 10 et à 100
- Tables de soustraction
- Compréhension de l'heure (lecture d'horloge)
- Compréhension de la monnaie (calcul de rendu)
- Exercices de probabilité (pourcentages)

L'application est servie par **Nginx** et déployable facilement avec **Docker / Docker Compose**.

## Prérequis

- Docker 24+
- Docker Compose (plugin `docker compose`)

## Installation rapide (Docker Compose)

1. Placez-vous dans le dossier du projet (sans Git) :
   ```bash
   cd /chemin/vers/mathematiques
   ```
2. Lancez l'application :
   ```bash
   docker compose up -d --build
   ```
3. Ouvrez votre navigateur :
   - http://localhost:1987

## Publier l'image Docker (sans Git)

1. Définissez le nom de l'image :
   ```bash
   export MATHS_APP_IMAGE=docker.io/<votre-user>/mathematiques:1.0.0
   ```
2. Construisez l'image :
   ```bash
   docker compose build
   ```
3. Connectez-vous au registre :
   ```bash
   docker login
   ```
4. Poussez l'image :
   ```bash
   docker compose push
   ```
5. Déployez sur un serveur avec la même variable :
   ```bash
   export MATHS_APP_IMAGE=docker.io/<votre-user>/mathematiques:1.0.0
   docker compose up -d
   ```

## Commandes utiles

- Démarrer / reconstruire :
  ```bash
  docker compose up -d --build
  ```
- Voir les logs :
  ```bash
  docker compose logs -f
  ```
- Arrêter :
  ```bash
  docker compose down
  ```
- Vérifier la configuration Compose :
  ```bash
  docker compose config
  ```

## Déploiement via Portainer (optionnel)

1. Dans **Stacks** > **Add stack**, importez le dépôt (Git) ou le contenu du projet.
2. Vérifiez que `docker-compose.yml` est utilisé.
3. Déployez la stack.
4. Exposez le port `1987` (ou modifiez la publication de port selon votre besoin).

## Configuration avec reverse proxy (optionnel)

Vous pouvez placer Nginx Proxy Manager / Traefik / Caddy devant l'application :
- Schéma : `http`
- Host cible : IP/nom du serveur Docker
- Port cible : `1987`

## Structure du projet

- `Dockerfile` : image Nginx contenant les ressources statiques.
- `docker-compose.yml` : orchestration locale/serveur.
- `nginx.conf` : configuration serveur HTTP (cache, sécurité, gzip, healthcheck).
- `*.html`, `*.js`, `styles.css` : application front.
- `img/wallpaper.png` : fond d'écran.

## Sécurité et performance

- En-têtes HTTP de sécurité (CSP, X-Frame-Options, etc.)
- Compression gzip
- Cache long pour assets statiques
- Endpoint de santé `/healthz`
- Healthcheck Docker basé sur Nginx

## Dépannage

1. **Le service ne démarre pas**
   - Vérifiez les logs : `docker compose logs -f`
   - Vérifiez la config : `docker compose config`

2. **L'application n'est pas accessible**
   - Vérifiez que le port `1987` est ouvert / non occupé
   - Testez : `curl http://localhost:1987/healthz`

3. **Image de fond absente**
   - Vérifiez la présence de `img/wallpaper.png`
   - Rechargez le conteneur : `docker compose up -d --build`
