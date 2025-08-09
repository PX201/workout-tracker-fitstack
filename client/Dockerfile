# ---- Build stage ----
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Static serve with Nginx ----
# FROM nginx:1.27-alpine
# # Optional: SPA fallback (uncomment nginx.conf section below if you need client-side routing)
# # COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80


# Serve stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
