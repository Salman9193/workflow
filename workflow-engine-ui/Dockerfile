# ---- Build stage ----
FROM node:22-alpine AS build

WORKDIR /app

# Install deps first (better layer caching — only reinstalls when package files change)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps=false

# Copy source and build production bundle
COPY . .
RUN npm run build -- --configuration production

# ---- Serve stage ----
FROM nginx:1.27-alpine AS serve

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Angular CLI outputs to dist/<project-name>/browser (Angular 17+ application builder).
# Adjust <project-name> to match the "name" field in your angular.json / package.json.
COPY --from=build /app/dist/workflow-engine-ui/browser /usr/share/nginx/html

# Custom nginx config for Angular's client-side routing (serves index.html for unknown paths)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
