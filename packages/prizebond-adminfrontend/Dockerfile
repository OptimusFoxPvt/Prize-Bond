
FROM node:16-alpine3.13 AS build-stage
#Alpine is linux tool
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
ENV PORT=3001

EXPOSE 3000

FROM node:16-alpine3.13
WORKDIR /app
RUN npm install -g serve
COPY --from=build-stage /app/build ./build
EXPOSE 3000
CMD ["serve", "-s",  "build"]