# Use Node.js LTS (Latest LTS version for 2024)
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Set host to allow external connections
ENV HOST=0.0.0.0

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]