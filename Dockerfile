FROM oven/bun:1-alpine AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install

FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

EXPOSE 4000

CMD ["bun", "run", "src/index.ts"]