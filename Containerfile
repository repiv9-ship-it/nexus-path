FROM node:20-alpine AS builder
label author "*Louay Bouzidi"
MAINTAINER louaybouzidi72@gmail.com
# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm i

# Copy the rest of the project
COPY . .

# Build the Vite app
RUN npm run build


# ---------- Stage 2: Serve ----------
FROM nginx

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
