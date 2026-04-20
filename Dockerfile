FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY server/ ./server/
COPY --from=build /app/dist ./dist/
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server/index.js"]