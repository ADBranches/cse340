# Use Node 20 for best LTS stability
FROM node:20

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the app source
COPY . .

# Set environment variables (Docker Compose will override these)
ENV NODE_ENV=development
ENV PORT=3000

# Expose the port your app runs on
EXPOSE 3000

# Start your Node app (same as Render)
CMD ["npm", "start"]
