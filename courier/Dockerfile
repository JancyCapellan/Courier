FROM node:16-alpine

# Set working directory
WORKDIR /app

# Install PM2 globally
RUN npm install pm2@latest -g

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN npm ci

COPY .env ./
COPY ./prisma ./prisma/
# Copy all files
COPY . ./

RUN npx prisma generate
# Build app
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER nextjs

# Run npm start script with PM2 when container starts
CMD ["npm", "run", "pm2:migrate"]
# CMD [ "pm2", "start", "node", "--", "run" "startStandalone" ]