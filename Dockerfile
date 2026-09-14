FROM node:24-alpine AS build-env
WORKDIR /app
COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn/releases/* ./.yarn/releases/
RUN corepack enable
RUN yarn install
COPY src ./src
COPY tsconfig.json ./tsconfig.json
RUN yarn run build

FROM node:24-alpine AS runtime-env
WORKDIR /app
COPY --from=build-env /app/.yarnrc.yml /app/package.json /app/yarn.lock ./
COPY --from=build-env /app/.yarn/ ./.yarn
COPY --from=build-env /app/node_modules/ ./node_modules
COPY --from=build-env /app/dist/ ./dist
CMD ["node", "./dist/index.js"]
