# --- build stage ---
FROM node:20 AS build
WORKDIR /app

# pass in the var as an ARG and expose as ENV so `npm run build` sees it
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- serve stage ---
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# if you have a custom nginx.conf, copy it too
COPY nginx.conf /etc/nginx/conf.d/default.conf
