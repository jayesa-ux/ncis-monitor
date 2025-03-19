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
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]