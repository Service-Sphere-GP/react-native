FROM node:22
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 8081
CMD ["npm", "run", "start"]