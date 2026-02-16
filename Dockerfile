FROM nginx:1.27-alpine

# Outil utilisé par le HEALTHCHECK
RUN apk add --no-cache curl

# Nettoyage des assets par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers statiques
COPY *.html /usr/share/nginx/html/
COPY *.js /usr/share/nginx/html/
COPY *.css /usr/share/nginx/html/
COPY img /usr/share/nginx/html/img

# Configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Vérification de santé
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
