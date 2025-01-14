FROM node:alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src /app/src
RUN ls -a
RUN npm install
RUN npm run build
RUN npm prune --production
EXPOSE 2000
CMD [ "node", "./build/index.js" ]