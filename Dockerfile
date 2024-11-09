# Step 1: Build the application
FROM node:18 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Step 2: Serve the application
FROM node:18
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/dist ./dist

# Install serve globally to serve the static files
RUN npm install -g serve

EXPOSE 3000
# Use CMD in JSON array format to serve the static files
CMD ["serve", "-s", "dist"]
