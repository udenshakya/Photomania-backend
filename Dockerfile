FROM node:20.10.0-alpine3.18 as dep

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

FROM node:20.10.0-alpine3.18 as local

WORKDIR /app

COPY --from=dep /app/node_modules /app/node_modules
COPY . .

CMD ["npm", "run", "dev"]
