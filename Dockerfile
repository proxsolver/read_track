# Use Node.js LTS version
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files and patches
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 10000

# Start the application
CMD ["pnpm", "run", "start"]
