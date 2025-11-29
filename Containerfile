FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY . .

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application files

# Build the TypeScript code
# RUN npm run build

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "server-compiti.js"]