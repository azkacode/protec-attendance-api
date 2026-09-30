FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN rm -rf dist \
  && npm run build \
  && node -e "const fs=require('fs'); const source=fs.readFileSync('dist/app.js','utf8'); if (!source.includes('require(')) { throw new Error('The compiled Attendance API is not CommonJS.'); }"

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

EXPOSE 3000

USER node

CMD ["node", "dist/app.js"]
