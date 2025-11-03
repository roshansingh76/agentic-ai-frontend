# Stage 1: Build React app
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

# Add curl and use it for health check
RUN apk add --no-cache curl
HEALTHCHECK CMD curl -fs http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
