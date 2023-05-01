FROM node:18-alpine as builder

WORKDIR /usr/app

COPY package.json esbuild.config.js pnpm-lock.yaml ./
COPY src ./src

RUN npm install -g pnpm && \
    pnpm install --production --ignore-scripts && \
    pnpm build

FROM node:18-alpine

WORKDIR /usr/app

COPY package.json ./
COPY --from=builder /usr/app/dist dist
COPY --from=builder /usr/app/node_modules node_modules

EXPOSE 4000

CMD node dist/server.js --enable-source-maps