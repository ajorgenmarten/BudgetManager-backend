FROM node:22-alpine AS build

ENV DATABASE_URL=postgres://user:password@localhost:5432/budget_manager?schema=public

WORKDIR /home/node/app
COPY package.json .
COPY pnpm-lock.yaml .
COPY nest-cli.json .
COPY prisma.config.ts .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY src/ ./src/
COPY prisma/ ./prisma/

RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm exec prisma generate
RUN pnpm build

FROM node:22-alpine AS production

ENV DATABASE_URL=postgres://user:password@localhost:5432/budget-manager?schema=public

WORKDIR /home/node/app

COPY --from=build /home/node/app/dist dist
COPY prisma/ ./prisma/
COPY package.json .
COPY pnpm-lock.yaml .
COPY prisma.config.ts .

RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile --prod
RUN pnpm exec prisma generate

CMD node dist/src/main.js
