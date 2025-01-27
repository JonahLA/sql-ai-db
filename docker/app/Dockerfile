FROM node:18

# Install dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Copy in the rest of the application code
COPY . . 

EXPOSE 3000

CMD ["npm", "run", "dev"]
