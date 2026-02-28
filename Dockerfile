# ===========================================
# CV Maker - Dockerfile pour Railway (racine du repo)
# Build Vite + serve statique avec nginx
# ===========================================

# ---- Étape 1: Build ----
FROM node:20-alpine AS builder
WORKDIR /app

# Variables Vite (Railway les injecte via --build-arg)
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
ARG VITE_KEYCLOAK_CLIENT_SECRET
ARG VITE_KEYCLOAK_ADMIN_CLIENT_ID
ARG VITE_KEYCLOAK_ADMIN_CLIENT_SECRET
ARG VITE_LOCAL_MODE
ARG VITE_DISABLE_FIRESTORE

ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL \
    VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM \
    VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID \
    VITE_KEYCLOAK_CLIENT_SECRET=$VITE_KEYCLOAK_CLIENT_SECRET \
    VITE_KEYCLOAK_ADMIN_CLIENT_ID=$VITE_KEYCLOAK_ADMIN_CLIENT_ID \
    VITE_KEYCLOAK_ADMIN_CLIENT_SECRET=$VITE_KEYCLOAK_ADMIN_CLIENT_SECRET \
    VITE_LOCAL_MODE=$VITE_LOCAL_MODE \
    VITE_DISABLE_FIRESTORE=$VITE_DISABLE_FIRESTORE

COPY app/package*.json ./
RUN npm ci 2>/dev/null || npm install
COPY app/ ./
RUN npm run build

# ---- Étape 2: Serveur statique ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Config nginx pour SPA (fallback vers index.html)
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /silent-check-sso.html { \
        try_files $uri =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
