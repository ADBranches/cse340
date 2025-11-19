FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the project
COPY . .

# Expose port Render will use
EXPOSE 3000

# Start your app like Render does
CMD ["npm", "start"]

