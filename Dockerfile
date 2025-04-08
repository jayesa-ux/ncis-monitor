# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Set up environment variable for production build
ENV NODE_ENV=production

# Build the app for production
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built app from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create a simple configuration for the React app
RUN echo 'server {
    listen 80;
    server_name localhost;

    # Configuración para rutas API que comienzan con /api/
    location ^~ /api/ {
        # Utilizar la IP externa del servidor donde se ejecuta el backend
        # Cambiar esta IP a la dirección correcta donde se ejecuta tu backend
        proxy_pass http://api-api-1:5000/;
        rewrite ^/api/(.*)$ /$1 break;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Aumentar tiempos de espera para conexiones lentas
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Configuración para /home y otras rutas SPA
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Configuración de caché para archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        root /usr/share/nginx/html;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Comprimir respuestas
    gzip on;
    gzip_comp_level 6;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]